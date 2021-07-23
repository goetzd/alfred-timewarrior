import {AlfredItems, toAlfredItem} from "../types/Timecard";
import {fetchFromTimewarrior, TimewarriorCommand} from "../timewarriorFetcher";
import {getDateStringWithRoundedGranularity} from "../timeUtils";
import {parseTimecard} from "../timewarriorParser";

export const stopTracking = (parameters: string): AlfredItems => {
  const json = fetchFromTimewarrior(TimewarriorCommand.NOW);
  const singleElement = json[0];

  let stopTime = parameters;
  if (parameters === '') {
    const now = new Date();
    stopTime = getDateStringWithRoundedGranularity(now);
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
