import {AlfredItems, toAlfredItem} from "../types/Timecard";
import {fetchFromTimewarrior, TimewarriorCommand} from "../timewarriorFetcher";
import config from "../config.json";
import {parseTimecard} from "../timewarriorParser";

export const continueTracking = (parameters: string): AlfredItems => {
  const json = fetchFromTimewarrior(config.timewExecutable, TimewarriorCommand.NOW);

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
