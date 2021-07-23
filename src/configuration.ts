import {readFileSync} from "fs";

export type Configuration = {
  timewExecutable: string,
  granularityInMinutes: number,
  logoForTag: {
    [key: string]: string
  }
};

export const configuration: Configuration = JSON.parse(readFileSync('config.json').toString('utf8'));
