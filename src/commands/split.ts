import { getDateStringWithFlooredGranularity, padTimeElement } from "../timeUtils";
import { fetchFromTimewarrior, TimewarriorCommand } from "../timewarriorFetcher";
import { parseTimecard } from "../timewarriorParser";
import { AlfredItems, toAlfredItem } from "../types/Timecard";

export const split = (parameters: string): AlfredItems => {
  const json = fetchFromTimewarrior(TimewarriorCommand.NOW);
  if (json.length === 0) {
    return {
      items: [
        {
          title: `⛔️ No time tracking in progress, can only split active time tracking!`,
        }
      ]
    }
  }

  const singleElement = parseTimecard(json[0]!);

  const splitParameters = parseSplitParameters(parameters);

  let tagInformation = `🏷 ${singleElement.tags.join(' 🏷 ')}`;
  if (splitParameters.tags.length > 0) {
    tagInformation = `🏷 ${splitParameters.tags.join(' 🏷 ')}`;
  }

  const subtitle = `${singleElement.title.replace(/\t/g, ' ').replace(/\s+/g, ' ')} ${singleElement.subtitle}`;

  return {
    items: [
      {
        ...toAlfredItem(singleElement),
        title: `✂️ at ${splitParameters.time}, ${tagInformation}`,
        subtitle,
        arg: `stop ${splitParameters.time} && continue ${splitParameters.time} ${splitParameters.tags.join(' ')}`,
        text: {
          copy: `timew stop ${splitParameters.time} && timew continue ${splitParameters.time} ${splitParameters.tags.join(' ')}`
        },
        icon: singleElement.icon,
        valid: splitParameters.valid
      }
    ]
  }
}

type SplitParameters = {
  time: string;
  tags: string[];
  valid: boolean;
}

function parseSplitParameters(parameters: string): SplitParameters {
  let result: SplitParameters = {
    time: getDateStringWithFlooredGranularity(new Date()),
    tags: [],
    valid: true
  }

  const items = parameters.split(/\s/);
  items.forEach(i => {
    if (i.match(/\d+:\d+/)) {
      const parsedTime = parseTime(i);
      result.time = parsedTime.time;
      result.valid = result.valid && parsedTime.valid;
    } else {
      if (i.trim() !== '') {
        result.tags.push(i);
      }
    }
  })

  return result;
}

function parseTime(timeString: string): { time: string; valid: boolean } {
  const details = timeString.split(':');
  const hours = details[0] ?? '';
  const minutes = details[1] ?? ''
  if (details.length !== 2 || hours.length > 2 || hours.length < 1 || minutes.length !== 2) {
    return {
      time: `${timeString} – ⛔️ Format should be hh:mm!`,
      valid: false
    };
  }
  const now = new Date();
  const stopDate = new Date();
  stopDate.setHours(Number.parseInt(hours, 10));
  stopDate.setMinutes(Number.parseInt(minutes, 10));
  if (stopDate > now) {
    return {
      time: `${timeString} – ⛔️ Split time must not be in the future!`,
      valid: false
    };
  }

  return {
    time: `${padTimeElement(stopDate.getHours())}:${padTimeElement(stopDate.getMinutes())}`,
    valid: true
  };
}
