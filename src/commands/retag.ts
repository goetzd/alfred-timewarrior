import {fetchFromTimewarrior, TimewarriorCommand} from "../timewarriorFetcher";
import config from "../config.json";
import {parseTimecard} from "../timewarriorParser";
import {AlfredItems, toAlfredItem} from "../types/Timecard";

export const retag = (parameters: string): AlfredItems => {
  const json = fetchFromTimewarrior(config.timewExecutable, TimewarriorCommand.START_OF_PREVIOUS_WEEK_UNTIL_NOW);

  const items = json
    .map((element) => parseTimecard(element))
    .map((element) => {
      return {
        ...toAlfredItem(element),
        title: `✏️ ${element.title} → 🆕 ${parameters}`,
        arg: `untag @${element.id} ${element.tags.join(' ')} && tag @${element.id} ${parameters}`,
        text: {
          copy: `timew untag @${element.id} ${element.tags.join(' ')} && timew tag @${element.id} ${parameters}`
        }
      }
    });

  return {items: items.reverse()};
}
