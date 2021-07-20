import {AlfredItems} from "../types/Timecard";

export const undo = (): AlfredItems => {
  return {
    items: [{
      title: `⎌ Undo last action`,
      arg: `undo`,
      text: {
        copy: 'timew undo'
      }
    }]
  };
}
