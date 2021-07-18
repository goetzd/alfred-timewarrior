type AlfredItem = {
  title: string,
  subtitle?: string,
  icon?: TimecardIcon,
  text?: TimecardText,
  autocomplete?: string,
  valid?: boolean
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
}

export type TimecardIcon = {
  path: string;
}

export type TimecardText = {
  copy: string;
}
