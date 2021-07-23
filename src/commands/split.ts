import {fetchFromTimewarrior, TimewarriorCommand} from "../timewarriorFetcher";
import {getDateStringWithRoundedGranularity} from "../timeUtils";
import {parseTimecard} from "../timewarriorParser";
import {AlfredItems, toAlfredItem} from "../types/Timecard";

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

  let splitTime = parameters;
  let valid = true
  if (parameters === '') {
    const now = new Date();
    splitTime = getDateStringWithRoundedGranularity(now);
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
        ...toAlfredItem(singleElement),
        title: `✂️ at ${splitTime}`,
        subtitle: `${singleElement.title}, ${singleElement.subtitle}`,
        arg: `stop ${splitTime} && continue ${splitTime}`,
        text: {
          copy: `timew stop ${splitTime} && timew continue ${splitTime}`
        },
        icon: singleElement.icon,
        valid
      }
    ]
  }
}
