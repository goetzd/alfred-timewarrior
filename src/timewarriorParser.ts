import {TimewarriorTimecard} from "./types/TimewarriorTimecard";
import {Timecard} from "./types/Timecard";
import {padTimeElement} from "./timeUtils";
import {configuration} from "./configuration";

const parseHour = (hourString: string): number => {
  return parseInt(hourString, 10) + 2;
}

const getIconNameForTags = (tags: string[]): string => {
  const logos = configuration.logoForTag;

  const firstTag = tags[0] as keyof typeof logos;
  if (firstTag === undefined) {
    return configuration.logoForTag.DefaultIcon ?? '';
  }
  const logoFileName = configuration.logoForTag[firstTag];
  return logoFileName ?? configuration.logoForTag.DefaultIcon ?? '';
}

export const parseTimecard = (timecard: TimewarriorTimecard): Timecard => {
  const id = timecard.id.toFixed(0);
  const tags = timecard.tags ?? [];
  const annotation = timecard.annotation ?? '<No annotation>';

  const startYear = parseInt(timecard.start.substring(0, 4));
  const startMonth = parseInt(timecard.start.substring(4, 6));
  const startDay = parseInt(timecard.start.substring(6, 8));
  const startHours = parseHour(timecard.start.substring(9, 11));
  const startMinutes = parseInt(timecard.start.substring(11, 13));
  const startTime = new Date(startYear, startMonth - 1, startDay, startHours, startMinutes, 0, 0);

  let endString = '';
  let endTime = new Date();
  if (timecard.end !== undefined) {
    const endYear = parseInt(timecard.end.substring(0, 4));
    const endMonth = parseInt(timecard.end.substring(4, 6));
    const endDay = parseInt(timecard.end.substring(6, 8));
    const endHours = parseHour(timecard.end.substring(9, 11));
    const endMinutes = parseInt(timecard.end.substring(11, 13));
    endString = ` – ${padTimeElement(endHours)}:${padTimeElement(endMinutes)}`;
    endTime = new Date(endYear, endMonth - 1, endDay, endHours, endMinutes, 0, 0);
  }

  const iconName = getIconNameForTags(tags);

  return {
    id,
    title: `${tags.join(', ')}: ${padTimeElement(startDay)}.${padTimeElement(startMonth)}. ${padTimeElement(startHours)}:${padTimeElement(startMinutes)}${endString}`,
    subtitle: annotation,
    icon: {
      path: iconName
    },
    tags,
    startTime,
    endTime,
    durationInMin: (endTime.getTime() - startTime.getTime()) / 60000,
    text: {
      copy: annotation
    }
  }
}
