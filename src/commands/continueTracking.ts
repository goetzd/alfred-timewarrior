import {AlfredItems, toAlfredItem} from "../types/Timecard";
import {fetchFromTimewarrior, TimewarriorCommand} from "../timewarriorFetcher";
import {parseTimecard} from "../timewarriorParser";
import {getDateStringWithFlooredGranularity} from "../timeUtils";

export const continueTracking = (parameters: string): AlfredItems => {
  const json = fetchFromTimewarrior(TimewarriorCommand.NOW);

  if (json.length > 0) {
    const singleElement = parseTimecard(json[0]!);
    return {
      items: [
        {
          ...toAlfredItem(singleElement),
          title: `⛔️ Time tracking in progress, please stop first!`,
          subtitle: `${singleElement.title}, ${singleElement.subtitle}`,
          valid: false
        }
      ]
    }
  }

  let stopTime = parameters;
  if (parameters === '') {
    const now = new Date();
    stopTime = getDateStringWithFlooredGranularity(now);
  }

  let subtitle = 'Syntax: <Timestamp>'
  return {
    items: [
      {
        title: `⏯ ${stopTime}`,
        subtitle,
        arg: `continue ${stopTime}`,
        text: {
          copy: `timew continue ${stopTime}`
        }
      }
    ]
  };
}
