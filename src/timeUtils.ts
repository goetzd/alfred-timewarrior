import {configuration} from "./configuration";

export const padTimeElement = (hoursOrMinutes: number) => {
  return ('00' + hoursOrMinutes).slice(-2);
}

export const getDateStringWithRoundedGranularity = (date: Date) => {
  const decimalMinutes = getDecimalMinutes(date);
  const roundedMinutes = Math.round(decimalMinutes / configuration.granularityInMinutes) * configuration.granularityInMinutes;
  return createHhMmString(date.getHours(), roundedMinutes);
}

export const getDateStringWithFlooredGranularity = (date: Date) => {
  const decimalMinutes = getDecimalMinutes(date);
  const flooredMinutes = Math.floor(decimalMinutes / configuration.granularityInMinutes) * configuration.granularityInMinutes;
  return createHhMmString(date.getHours(), flooredMinutes);
}

const getDecimalMinutes = (date: Date) => {
  return date.getMinutes() + (date.getSeconds() / 60);
};

const createHhMmString = (hours: number, minutes: number): string => {
  if (minutes >= 60) {
    minutes = 0;
    hours += 1;
  }
  return `${padTimeElement(hours)}:${padTimeElement(minutes)}`;
}
