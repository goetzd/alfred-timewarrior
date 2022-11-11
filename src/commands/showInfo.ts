import { configuration } from "../configuration";
import { padTimeElement } from "../timeUtils";
import { fetchFromTimewarrior, TimewarriorCommand } from "../timewarriorFetcher";
import { parseTimecard } from "../timewarriorParser";
import { AlfredItems, Timecard } from "../types/Timecard";

export const showInfo = (): AlfredItems => {
  const jsonToday = fetchFromTimewarrior(TimewarriorCommand.TODAY);
  const timecardsToday = jsonToday.map(parseTimecard);

  let durationToday = 0;
  timecardsToday.forEach(item => durationToday += calculateTimeWithoutIgnoredTags(item));
  const totalHoursToday = Math.floor(durationToday / 60);
  const totalMinutesToday = Math.round(durationToday - totalHoursToday * 60);
  const overtimeToday = durationToday - (8 * 60);
  const overtimeTodaySign = overtimeToday > 0 ? '+' : '-';
  const totalHoursOvertimeToday = Math.floor(Math.abs(overtimeToday / 60));
  const totalMinutesOvertimeToday = Math.round(Math.abs(overtimeToday) - totalHoursOvertimeToday * 60);
  const overtimeTodayIcon = overtimeToday >= 0 ? '🎉' : '🚨';

  const jsonMonth = fetchFromTimewarrior(TimewarriorCommand.START_OF_MONTH_UNTIL_NOW_EXCLUDING_TODAY);
  const timecardsMonth = jsonMonth.map(parseTimecard);

  let durationMonth = 0;
  timecardsMonth.forEach(item => durationMonth += calculateTimeWithoutIgnoredTags(item));
  const numberOfDaysTrackedThisMonth = [...new Set(timecardsMonth.flatMap(item => item.startTime.getDate()))].length;
  const totalHoursMonth = Math.floor(durationMonth / 60);
  const totalMinutesMonth = Math.round(durationMonth - totalHoursMonth * 60);
  const overtimeMonth = durationMonth - (numberOfDaysTrackedThisMonth * 8 * 60);
  const overtimeMonthSign = overtimeMonth > 0 ? '+' : '-';
  const totalHoursOvertimeMonth = Math.floor(Math.abs(overtimeMonth / 60));
  const totalMinutesOvertimeMonth = Math.abs(Math.round(Math.abs(overtimeMonth) - totalHoursOvertimeMonth * 60));
  const overtimeMonthIcon = overtimeMonth >= 0 ? '🎉' : '🚨';

  return {
    items: [
      {
        title: `Total time\t\t📅   ${padTimeElement(totalHoursToday)}:${padTimeElement(totalMinutesToday)}   \t\t🗓   ${padTimeElement(totalHoursMonth)}:${padTimeElement(totalMinutesMonth)}`,
        valid: false
      },
      {
        title: `Overtime\t\t${overtimeTodayIcon} ${overtimeTodaySign}${padTimeElement(totalHoursOvertimeToday)}:${padTimeElement(totalMinutesOvertimeToday)}   \t\t${overtimeMonthIcon} ${overtimeMonthSign}${padTimeElement(totalHoursOvertimeMonth)}:${padTimeElement(totalMinutesOvertimeMonth)}`,
        valid: false
      }
    ]
  };
}

const calculateTimeWithoutIgnoredTags = (timecard: Timecard) => {
  const ignoredTags = configuration.ignoredTagsForWorkingTime;
  const ignoredTagFound = ignoredTags.filter((tag) => timecard.tags.includes(tag)).length > 0;
  return ignoredTagFound ? 0 : timecard.durationInMin;
}
