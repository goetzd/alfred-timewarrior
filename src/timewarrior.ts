import config from './config.json';
import {AlfredItems} from "./Timecard";
import {fetchFromTimewarrior, TimewarriorCommand} from "./timewarriorFetcher";
import {parseTimecard} from "./timewarriorParser";

const args = process.argv.slice(2).join(' ').trim().split(' ');
const action = args[0]?.trim() ?? '';
const parameters = args.slice(1).join(' ');

const padTimeElement = (hoursOrMinutes: number) => {
  return ('00' + hoursOrMinutes).slice(-2);
}

const fullHelp: AlfredItems = {
  items: [
    {
      title: 'annotate',
      subtitle: 'Annotate the selected item',
      autocomplete: 'annotate ',
      valid: false
    },
    {
      title: 'continue',
      subtitle: 'Continue from the previous timecard',
      autocomplete: 'continue ',
      valid: false
    },
    {
      title: 'info',
      subtitle: 'Show information for today\'s and this month\'s tracked time',
      autocomplete: 'info',
      valid: false
    },
    {
      title: 'retag',
      subtitle: 'Remove all tags and add new tag',
      autocomplete: 'retag ',
      valid: false
    },
    {
      title: 'split',
      subtitle: 'Split the current timecard',
      autocomplete: 'split ',
      valid: false
    },
    {
      title: 'start',
      subtitle: 'Start a new timecard',
      autocomplete: 'start ',
      valid: false
    },
    {
      title: 'stop',
      subtitle: 'Stop the running timecard',
      autocomplete: 'stop ',
      valid: false
    },
    {
      title: 'undo',
      subtitle: 'Undo your last action',
      autocomplete: 'undo',
      valid: false
    }
  ]
};

const showHelp = () => {
  if (action === '' || action === '?') {
    return fullHelp;
  }

  const sortedItems = fullHelp.items.sort((a, b) => {
    const aValue = `${a.autocomplete}`.startsWith(action);
    const bValue = `${b.autocomplete}`.startsWith(action);
    if (aValue && !bValue) {
      return -1;
    }
    if (!aValue && bValue) {
      return 1;
    }
    return 0;
  });

  return {
    items: sortedItems
  }
};

const continueTracking = () => {
  const json = fetchFromTimewarrior(config.timewExecutable, TimewarriorCommand.NOW);

  if (json.length > 0) {
    const singleElement = parseTimecard(json[0]!);
    return {
      items: [
        {
          ...singleElement,
          title: `⛔️ Time tracking in progress, please stop first!`,
          subtitle: `${singleElement.title}, ${singleElement.subtitle}`,
          valid: false
        }
      ]
    }
  }

  let subtitle = 'Syntax: <Timestamp>'
  return {
    items: [
      {
        title: `⏯ ${parameters}`,
        subtitle,
        arg: `continue ${parameters}`,
        text: {
          copy: `timew continue ${parameters}`
        }
      }
    ]
  };
}

const showStatus = () => {
  const json = fetchFromTimewarrior(config.timewExecutable, TimewarriorCommand.START_OF_PREVIOUS_WEEK_UNTIL_NOW);
  const resultJson = json.map((element) => parseTimecard(element));
  return {items: resultJson.reverse()};
}

const annotate = () => {
  const json = fetchFromTimewarrior(config.timewExecutable, TimewarriorCommand.START_OF_PREVIOUS_WEEK_UNTIL_NOW);

  const items = json
    .map((element) => parseTimecard(element))
    .map((element) => {
      return {
        ...element,
        subtitle: `✏️ ${element.subtitle} → 🆕 ${parameters}`,
        arg: `annotate @${element.id} "${parameters}"`,
        text: {
          copy: `timew annotate @${element.id} "${parameters}"`
        }
      }
    });

  return {items: items.reverse()};
}

const retag = () => {
  const json = fetchFromTimewarrior(config.timewExecutable, TimewarriorCommand.START_OF_PREVIOUS_WEEK_UNTIL_NOW);

  const items = json
    .map((element) => parseTimecard(element))
    .map((element) => {
      return {
        ...element,
        title: `✏️ ${element.title} → 🆕 ${parameters}`,
        arg: `untag @${element.id} ${element.tags.join(' ')} && tag @${element.id} ${parameters}`,
        text: {
          copy: `timew untag @${element.id} ${element.tags.join(' ')} && timew tag @${element.id} ${parameters}`
        }
      }
    });

  return {items: items.reverse()};
}

const split = () => {
  const json = fetchFromTimewarrior(config.timewExecutable, TimewarriorCommand.NOW);
  if (json.length === 0) {
    return {
      items: [
        {
          title: `⛔️ No time tracking in progress, can only split active time tracking!`,
        }
      ]
    }
  }

  let splitTime = parameters;
  let valid = true
  if (parameters === '') {
    const now = new Date();
    const minutesRoundedByThree = Math.floor(now.getMinutes() / 3) * 3;
    splitTime = `${padTimeElement(now.getHours())}:${padTimeElement(minutesRoundedByThree)}`;
  } else {
    const details = parameters.split(':');
    const hours = details[0] ?? '';
    const minutes = details[1] ?? ''
    if (details.length !== 2 || hours.length > 2 || hours.length < 1 || minutes.length !== 2) {
      splitTime = `${parameters} – ⛔️ Format should be hh:mm!`
      valid = false;
    }
    const now = new Date();
    const stopDate = new Date();
    stopDate.setHours(Number.parseInt(hours, 10));
    stopDate.setMinutes(Number.parseInt(minutes, 10));
    if (stopDate > now) {
      splitTime = `${parameters} – ⛔️ Split time must not be in the future!`
      valid = false;
    }
  }

  const singleElement = parseTimecard(json[0]!);

  return {
    items: [
      {
        ...singleElement,
        title: `✂️ at ${splitTime}`,
        subtitle: `${singleElement.title}, ${singleElement.subtitle}`,
        arg: `stop ${splitTime} && continue ${splitTime}`,
        text: {
          copy: `timew stop ${splitTime} && timew continue ${splitTime}`
        },
        valid
      }
    ]
  }
}

const startTracking = () => {
  const json = fetchFromTimewarrior(config.timewExecutable, TimewarriorCommand.NOW);
  if (json.length > 0) {
    const singleElement = parseTimecard(json[0]!);
    return {
      items: [
        {
          ...singleElement,
          title: `⛔️ Time tracking in progress, please stop first!`,
          subtitle: `${singleElement.title}, ${singleElement.subtitle}`
        }
      ]
    }
  }

  let subtitle = 'Syntax: <Timestamp> <Project>'
  return {
    items: [
      {
        title: `▶️ ${parameters}`,
        subtitle,
        arg: `start ${parameters}`,
        text: {
          copy: `timew start ${parameters}`
        }
      }
    ]
  };
}

const showInfo = () => {
  const jsonToday = fetchFromTimewarrior(config.timewExecutable, TimewarriorCommand.TODAY);
  const timecardsToday = jsonToday.map(parseTimecard);

  let durationToday = 0;
  timecardsToday.forEach(item => durationToday += item.durationInMin);
  const totalHoursToday = Math.floor(durationToday / 60);
  const totalMinutesToday = Math.round(durationToday - totalHoursToday * 60);
  const overtimeToday = durationToday - (8 * 60);
  const overtimeTodaySign = overtimeToday > 0 ? '+' : '-';
  const totalHoursOvertimeToday = Math.floor(Math.abs(overtimeToday / 60));
  const totalMinutesOvertimeToday = Math.round(Math.abs(overtimeToday) - totalHoursOvertimeToday * 60);
  const overtimeTodayIcon = overtimeToday >= 0 ? '🍾' : '🌋';

  const tags = [...new Set(timecardsToday.flatMap(item => item.tags))];

  const jsonMonth = fetchFromTimewarrior(config.timewExecutable, TimewarriorCommand.START_OF_MONTH_UNTIL_NOW);
  const timecardsMonth = jsonMonth.map(parseTimecard);

  let durationMonth = 0;
  timecardsMonth.forEach(item => durationMonth += item.durationInMin);
  const numberOfDaysTrackedThisMonth = [...new Set(timecardsMonth.flatMap(item => item.startTime.getDate()))].length;
  const totalHoursMonth = Math.floor(durationMonth / 60);
  const totalMinutesMonth = Math.round(durationMonth - totalHoursMonth * 60);
  const overtimeMonth = durationMonth - (numberOfDaysTrackedThisMonth * 8 * 60);
  const overtimeMonthSign = overtimeMonth > 0 ? '+' : '-';
  const totalHoursOvertimeMonth = Math.floor(Math.abs(overtimeMonth / 60));
  const totalMinutesOvertimeMonth = Math.abs(Math.round(Math.abs(overtimeMonth) - totalHoursOvertimeMonth * 60));
  const overtimeMonthIcon = overtimeMonth >= 0 ? '🍾' : '🌋';

  return {
    items: [
      {
        title: `Total time today: ${totalHoursToday}h ${totalMinutesToday}min`,
        subtitle: `Tags: ${tags.join(', ')}`,
        valid: false
      },
      {
        title: `${overtimeTodayIcon} Overtime: ${overtimeTodaySign}${totalHoursOvertimeToday}h ${totalMinutesOvertimeToday}min`,
        valid: false
      },
      {
        title: `${overtimeMonthIcon} Overtime this month: ${overtimeMonthSign}${totalHoursOvertimeMonth}h ${totalMinutesOvertimeMonth}min`,
        subtitle: `Total time this month: ${totalHoursMonth}h ${totalMinutesMonth}min`,
        valid: false
      }
    ]
  };
}

const stopTracking = () => {
  const json = fetchFromTimewarrior(config.timewExecutable, TimewarriorCommand.NOW);
  const singleElement = json[0];

  let stopTime = parameters;
  if (parameters === '') {
    const now = new Date();
    const minutesRoundedByThree = Math.round(now.getMinutes() / 3) * 3;
    stopTime = `${padTimeElement(now.getHours())}:${padTimeElement(minutesRoundedByThree)}`;
  }

  const resultJson = parseTimecard(singleElement!);

  return {
    items: [{
      ...resultJson,
      title: `⏹ ${resultJson.title} – ${stopTime}`,
      arg: `stop ${stopTime}`,
      text: {
        copy: `timew stop ${parameters}`
      }
    }]
  };
}

const undo = () => {
  return {
    items: [{
      title: `⎌ Undo last action`,
      arg: `undo`,
      text: {
        copy: 'timew undo'
      }
    }]
  };
}


let result: AlfredItems;

switch (action) {
  case '':
    result = {items: [...showInfo().items, ...showStatus().items]};
    break;
  case 'annotate':
    result = annotate();
    break;
  case 'continue':
    result = continueTracking();
    break;
  case 'info':
    result = showInfo();
    break;
  case 'retag':
    result = retag();
    break;
  case 'split':
    result = split();
    break;
  case 'start':
    result = startTracking();
    break;
  case 'stop':
    result = stopTracking();
    break;
  case 'undo':
    result = undo();
    break;
  default:
    result = showHelp();
}

console.log(JSON.stringify(result));
