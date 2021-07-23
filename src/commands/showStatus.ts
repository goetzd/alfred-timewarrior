import {fetchFromTimewarrior, TimewarriorCommand} from "../timewarriorFetcher";
import {parseTimecard} from "../timewarriorParser";
import {AlfredItems} from "../types/Timecard";

export const showStatus = (): AlfredItems => {
  const json = fetchFromTimewarrior(TimewarriorCommand.START_OF_PREVIOUS_WEEK_UNTIL_NOW);
  const resultJson = json.map((element) => parseTimecard(element));
  return {items: resultJson.reverse()};
}
