import {AlfredItems, toAlfredItem} from "../types/Timecard";
import {fetchFromTimewarrior, TimewarriorCommand} from "../timewarriorFetcher";
import config from "../config.json";
import {getDateStringRoundedBy} from "../timeUtils";
import {parseTimecard} from "../timewarriorParser";

export const stopTracking = (parameters: string): AlfredItems => {
  const json = fetchFromTimewarrior(config.timewExecutable, TimewarriorCommand.NOW);
  const singleElement = json[0];

  let stopTime = parameters;
  if (parameters === '') {
    const now = new Date();
    stopTime = getDateStringRoundedBy(now, 3);
  }

  const resultJson = parseTimecard(singleElement!);

  return {
    items: [{
      ...toAlfredItem(resultJson),
      title: `⏹ ${resultJson.title} – ${stopTime}`,
      arg: `stop ${stopTime}`,
      text: {
        copy: `timew stop ${parameters}`
      }
    }]
  };
}
