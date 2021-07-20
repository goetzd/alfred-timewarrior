import {TimewarriorTimecard} from "./types/TimewarriorTimecard";
import {execSync} from "child_process";

export const fetchFromTimewarrior = (timewExecutable: string, command: TimewarriorCommand): TimewarriorTimecard[] => {
  const result = execSync(`${timewExecutable} ${command}`);
  return JSON.parse(result.toString('utf8'));
};

export enum TimewarriorCommand {
  NOW = 'export now',
  START_OF_MONTH_UNTIL_NOW = 'export som - now',
  START_OF_PREVIOUS_WEEK_UNTIL_NOW = 'export sopw - now',
  TODAY = 'export today'
}
