import {fetchFromTimewarrior, TimewarriorCommand} from "../timewarriorFetcher";
import {parseTimecard} from "../timewarriorParser";
import {AlfredItems, toAlfredItem} from "../types/Timecard";

export const startTracking = (parameters: string): AlfredItems => {
  const json = fetchFromTimewarrior(TimewarriorCommand.NOW);
  if (json.length > 0) {
    const singleElement = parseTimecard(json[0]!);
    return {
      items: [
        {
          ...toAlfredItem(singleElement),
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
