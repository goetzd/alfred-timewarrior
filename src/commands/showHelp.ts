import { AlfredItems } from "../types/Timecard";

const fullHelp: AlfredItems = {
  items: [
    {
      title: 'annotate',
      subtitle: 'Annotate the selected item',
      autocomplete: 'annotate ',
      valid: false
    },
    {
      title: 'continue',
      subtitle: 'Continue from the previous timecard',
      autocomplete: 'continue ',
      valid: false
    },
    {
      title: 'info',
      subtitle: 'Show information for today\'s and this month\'s tracked time',
      autocomplete: 'info',
      valid: false
    },
    {
      title: 'retag',
      subtitle: 'Remove all tags and add new tag',
      autocomplete: 'retag ',
      valid: false
    },
    {
      title: 'split',
      subtitle: 'Split the current timecard',
      autocomplete: 'split ',
      valid: false
    },
    {
      title: 'start',
      subtitle: 'Start a new timecard',
      autocomplete: 'start ',
      valid: false
    },
    {
      title: 'stop',
      subtitle: 'Stop the running timecard',
      autocomplete: 'stop ',
      valid: false
    },
    {
      title: 'undo',
      subtitle: 'Undo your last action',
      autocomplete: 'undo',
      valid: false
    },
    {
      title: 'undo-split',
      subtitle: 'Undo your last two actions (as necessary for undoing a split)',
      autocomplete: 'undo-split',
      valid: false
    }
  ]
};

export const showHelp = (action: string): AlfredItems => {
  if (action === '' || action === '?') {
    return fullHelp;
  }

  const sortedItems = fullHelp.items.sort((a, b) => {
    const aValue = `${a.autocomplete}`.startsWith(action);
    const bValue = `${b.autocomplete}`.startsWith(action);
    if (aValue && !bValue) {
      return -1;
    }
    if (!aValue && bValue) {
      return 1;
    }
    return 0;
  });

  return {
    items: sortedItems
  }
};
