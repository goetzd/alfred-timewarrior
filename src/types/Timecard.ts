type AlfredItem = {
  title: string,
  subtitle?: string,
  icon?: TimecardIcon,
  text?: TimecardText,
  autocomplete?: string,
  valid?: boolean,
  arg?: string
};

type TimecardTimewarriorItems = {
  id: string,
  tags: string[],
  annotation?: string,
  startTime: Date,
  endTime?: Date,
  durationInMin: number,
};

export type Timecard = AlfredItem & TimecardTimewarriorItems;

export type AlfredItems = {
  items: AlfredItem[]
};

export type TimecardIcon = {
  path: string;
};

export type TimecardText = {
  copy: string;
};

export const toAlfredItem = (timecard: Timecard): AlfredItem => ({
  title: timecard.title,
  subtitle: timecard.subtitle,
  icon: timecard.icon,
  text: timecard.text,
  autocomplete: timecard.autocomplete,
  valid: timecard.valid,
  arg: timecard.arg
})
