import {configuration} from "./configuration";

export const padTimeElement = (hoursOrMinutes: number) => {
  return ('00' + hoursOrMinutes).slice(-2);
}

export const getDateStringWithRoundedGranularity = (date: Date) => {
  const roundedMinutes = Math.round(date.getMinutes() / configuration.granularityInMinutes) * configuration.granularityInMinutes;
  return createHhMmString(date.getHours(), roundedMinutes);
}

export const getDateStringWithFlooredGranularity = (date: Date) => {
  const flooredMinutes = Math.floor(date.getMinutes() / configuration.granularityInMinutes) * configuration.granularityInMinutes;
  return createHhMmString(date.getHours(), flooredMinutes);
}

const createHhMmString = (hours: number, minutes: number): string => {
  if (minutes >= 60) {
    minutes = 0;
    hours += 1;
  }
  return `${padTimeElement(hours)}:${padTimeElement(minutes)}`;
}
