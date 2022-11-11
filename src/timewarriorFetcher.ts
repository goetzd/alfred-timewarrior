import { execSync } from "child_process";
import { configuration } from "./configuration";
import { TimewarriorTimecard } from "./types/TimewarriorTimecard";

export const fetchFromTimewarrior = (command: TimewarriorCommand): TimewarriorTimecard[] => {
  const result = execSync(`${configuration.timewExecutable} ${command}`);
  return JSON.parse(result.toString('utf8'));
};

export enum TimewarriorCommand {
  NOW = 'export now',
  START_OF_MONTH_UNTIL_NOW = 'export som - now',
  START_OF_MONTH_UNTIL_NOW_EXCLUDING_TODAY = 'export som - today',
  START_OF_PREVIOUS_WEEK_UNTIL_NOW = 'export sopw - now',
  TODAY = 'export today'
}
