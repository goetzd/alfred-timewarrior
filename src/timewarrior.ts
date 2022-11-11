import { annotate } from "./commands/annotate";
import { continueTracking } from "./commands/continueTracking";
import { retag } from "./commands/retag";
import { showHelp } from "./commands/showHelp";
import { showInfo } from "./commands/showInfo";
import { showStatus } from "./commands/showStatus";
import { split } from "./commands/split";
import { startTracking } from "./commands/startTracking";
import { stopTracking } from "./commands/stopTracking";
import { undo } from "./commands/undo";
import { undoSplit } from "./commands/undoSplit";
import { AlfredItems } from "./types/Timecard";

const args = process.argv.slice(2).join(' ').trim().split(' ');
const action = args[0]?.trim() ?? '';
const parameters = args.slice(1).join(' ');

let result: AlfredItems;

switch (action) {
  case '':
    result = {items: [...showInfo().items, ...showStatus().items]};
    break;
  case 'annotate':
    result = annotate(parameters);
    break;
  case 'continue':
    result = continueTracking(parameters);
    break;
  case 'info':
    result = showInfo();
    break;
  case 'retag':
    result = retag(parameters);
    break;
  case 'split':
    result = split(parameters);
    break;
  case 'start':
    result = startTracking(parameters);
    break;
  case 'stop':
    result = stopTracking(parameters);
    break;
  case 'undo':
    result = undo();
    break;
  case 'undo-split':
    result = undoSplit();
    break;
  default:
    result = showHelp(action);
}

console.log(JSON.stringify(result));
