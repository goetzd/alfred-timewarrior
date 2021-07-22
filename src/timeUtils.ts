export const padTimeElement = (hoursOrMinutes: number) => {
  return ('00' + hoursOrMinutes).slice(-2);
}

export const getDateStringWithRoundedGranularityInMinutes = (date: Date, granularityInMinutes: number) => {
  const roundedMinutes = Math.round(date.getMinutes() / granularityInMinutes) * granularityInMinutes;
  return `${padTimeElement(date.getHours())}:${padTimeElement(roundedMinutes)}`;
}

export const getDateStringWithFlooredGranularityInMinutes = (date: Date, granularityInMinutes: number) => {
  const roundedMinutes = Math.floor(date.getMinutes() / granularityInMinutes) * granularityInMinutes;
  return `${padTimeElement(date.getHours())}:${padTimeElement(roundedMinutes)}`;
}
