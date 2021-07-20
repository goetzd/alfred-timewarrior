import {fetchFromTimewarrior, TimewarriorCommand} from "../timewarriorFetcher";
import config from "../config.json";
import {parseTimecard} from "../timewarriorParser";
import {AlfredItems} from "../types/Timecard";

export const showInfo = (): AlfredItems => {
  const jsonToday = fetchFromTimewarrior(config.timewExecutable, TimewarriorCommand.TODAY);
  const timecardsToday = jsonToday.map(parseTimecard);

  let durationToday = 0;
  timecardsToday.forEach(item => durationToday += item.durationInMin);
  const totalHoursToday = Math.floor(durationToday / 60);
  const totalMinutesToday = Math.round(durationToday - totalHoursToday * 60);
  const overtimeToday = durationToday - (8 * 60);
  const overtimeTodaySign = overtimeToday > 0 ? '+' : '-';
  const totalHoursOvertimeToday = Math.floor(Math.abs(overtimeToday / 60));
  const totalMinutesOvertimeToday = Math.round(Math.abs(overtimeToday) - totalHoursOvertimeToday * 60);
  const overtimeTodayIcon = overtimeToday >= 0 ? '😄' : '😩';

  const tags = [...new Set(timecardsToday.flatMap(item => item.tags))];

  const jsonMonth = fetchFromTimewarrior(config.timewExecutable, TimewarriorCommand.START_OF_MONTH_UNTIL_NOW);
  const timecardsMonth = jsonMonth.map(parseTimecard);

  let durationMonth = 0;
  timecardsMonth.forEach(item => durationMonth += item.durationInMin);
  const numberOfDaysTrackedThisMonth = [...new Set(timecardsMonth.flatMap(item => item.startTime.getDate()))].length;
  const totalHoursMonth = Math.floor(durationMonth / 60);
  const totalMinutesMonth = Math.round(durationMonth - totalHoursMonth * 60);
  const overtimeMonth = durationMonth - (numberOfDaysTrackedThisMonth * 8 * 60);
  const overtimeMonthSign = overtimeMonth > 0 ? '+' : '-';
  const totalHoursOvertimeMonth = Math.floor(Math.abs(overtimeMonth / 60));
  const totalMinutesOvertimeMonth = Math.abs(Math.round(Math.abs(overtimeMonth) - totalHoursOvertimeMonth * 60));
  const overtimeMonthIcon = overtimeMonth >= 0 ? '💚' : '🚨';

  return {
    items: [
      {
        title: `Total time today: ${totalHoursToday}h ${totalMinutesToday}min`,
        subtitle: `Tags: ${tags.join(', ')}`,
        valid: false
      },
      {
        title: `${overtimeTodayIcon} Overtime: ${overtimeTodaySign}${totalHoursOvertimeToday}h ${totalMinutesOvertimeToday}min`,
        valid: false
      },
      {
        title: `${overtimeMonthIcon} Overtime this month: ${overtimeMonthSign}${totalHoursOvertimeMonth}h ${totalMinutesOvertimeMonth}min`,
        subtitle: `Total time this month: ${totalHoursMonth}h ${totalMinutesMonth}min`,
        valid: false
      }
    ]
  };
}
