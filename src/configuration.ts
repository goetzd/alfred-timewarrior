import {readFileSync} from "fs";
import * as Path from "path";
import {homedir} from "os";

type Icons = {
  [key: string]: string
};

export type Configuration = {
  timewExecutable: string,
  granularityInMinutes: number,
  ignoredTagsForWorkingTime: string[],
  logoForTag: {
    [key: string]: string
  }
};

const defaultConfiguration: Configuration = {
  timewExecutable: '/usr/local/bin/timew',
  granularityInMinutes: 1,
  ignoredTagsForWorkingTime: [],
  logoForTag: {
    DefaultIcon: 'icon.png'
  }
};

const parseFile = (path: string) => {
  try {
    return JSON.parse(readFileSync(path).toString('utf8'));
  } catch {
    return undefined;
  }
}

const parseIcons = (logoForTag: Icons): Icons => {
  if (logoForTag === undefined || Object.keys(logoForTag).length === 0) {
    return defaultConfiguration.logoForTag;
  }

  Object.keys(logoForTag).map(key => logoForTag[key] = `${homedir()}/.alfred-timewarrior/${logoForTag[key]}`);

  return logoForTag;
}

const parseConfigurationJson = (): Configuration => {
  let config = parseFile(Path.join(homedir(), '.alfred-timewarrior/alfred-timewarrior.json'));

  return {
    timewExecutable: config?.timewExecutable ?? defaultConfiguration.timewExecutable,
    granularityInMinutes: parseInt(config?.granularityInMinutes, 10) ?? defaultConfiguration.granularityInMinutes,
    ignoredTagsForWorkingTime: config?.ignoredTagsForWorkingTime ?? defaultConfiguration.ignoredTagsForWorkingTime,
    logoForTag: parseIcons(config?.logoForTag)
  }
}

export const configuration: Configuration = parseConfigurationJson();
