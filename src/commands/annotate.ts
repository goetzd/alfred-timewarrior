import {fetchFromTimewarrior, TimewarriorCommand} from "../timewarriorFetcher";
import {parseTimecard} from "../timewarriorParser";
import {AlfredItems, toAlfredItem} from "../types/Timecard";

export const annotate = (parameters: string): AlfredItems => {
  const json = fetchFromTimewarrior(TimewarriorCommand.START_OF_PREVIOUS_WEEK_UNTIL_NOW);

  const items = json
    .map((element) => parseTimecard(element))
    .map((element) => {
      return {
        ...toAlfredItem(element),
        subtitle: `✏️ ${element.subtitle} → 🆕 ${parameters}`,
        arg: `annotate @${element.id} "${parameters}"`,
        text: {
          copy: `timew annotate @${element.id} "${parameters}"`
        }
      };
    });

  return {items: items.reverse()};
}
