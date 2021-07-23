import {configuration} from "./configuration";

export const padTimeElement = (hoursOrMinutes: number) => {
  return ('00' + hoursOrMinutes).slice(-2);
}

export const getDateStringWithRoundedGranularity = (date: Date) => {
  const roundedMinutes = Math.round(date.getMinutes() / configuration.granularityInMinutes) * configuration.granularityInMinutes;
  return `${padTimeElement(date.getHours())}:${padTimeElement(roundedMinutes)}`;
}

export const getDateStringWithFlooredGranularity = (date: Date) => {
  const roundedMinutes = Math.floor(date.getMinutes() / configuration.granularityInMinutes) * configuration.granularityInMinutes;
  return `${padTimeElement(date.getHours())}:${padTimeElement(roundedMinutes)}`;
}
