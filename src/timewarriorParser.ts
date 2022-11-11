import { configuration } from "./configuration";
import { padTimeElement } from "./timeUtils";
import { Timecard } from "./types/Timecard";
import { TimewarriorTimecard } from "./types/TimewarriorTimecard";

const stringToDate = (dateTimeString: string): Date => {
  const year = parseInt(dateTimeString.substring(0, 4));
  const month = parseInt(dateTimeString.substring(4, 6));
  const day = parseInt(dateTimeString.substring(6, 8));
  const hours = parseInt(dateTimeString.substring(9, 11), 10);
  const minutes = parseInt(dateTimeString.substring(11, 13));
  const dateInUtc = new Date(year, month - 1, day, hours, minutes, 0, 0);

  const timezoneHourOffset = dateInUtc.getTimezoneOffset() / 60;

  return new Date(year, month - 1, day, hours - timezoneHourOffset, minutes, 0, 0);
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

  const startTime = stringToDate(timecard.start);

  let endString = '';
  let endTime = new Date();
  if (timecard.end !== undefined) {
    endTime = stringToDate(timecard.end);
    endString = ` →️ ${padTimeElement(endTime.getHours())}:${padTimeElement(endTime.getMinutes())}`;
  }

  const iconName = getIconNameForTags(tags);

  const displayTags = tags.length > 0 ? `🏷 ${tags.join(' 🏷 ')}` : '';

  return {
    id,
    title: `${displayTags} 📅 ${padTimeElement(startTime.getDate())}.${padTimeElement(startTime.getMonth() + 1)}. 🕚 ${padTimeElement(startTime.getHours())}:${padTimeElement(startTime.getMinutes())}${endString}`,
    subtitle: `📝 ${annotation}`,
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
