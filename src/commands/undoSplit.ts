import { AlfredItems } from "../types/Timecard";

export const undoSplit = (): AlfredItems => {
  return {
    items: [{
      title: `⎌ Undo split action`,
      subtitle: 'Equivalent to undoing last two actions',
      arg: `undo && undo`,
      text: {
        copy: 'timew undo && timew undo'
      }
    }]
  };
}
