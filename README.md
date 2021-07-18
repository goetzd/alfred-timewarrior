# Timewarrior for Alfred

Get an overview over your latest tracked times in [timewarrior](https://timewarrior.net) and edit them easily.

## Requirements

You need to have `node` installed and accessable via the `node` command.
(In case it is not, find out where your desired local `node` executable is located and replace `node` in the file `execute.sh` with that path).

## Configuration

The file `config.json` contains user-definable settings and should be edited before using the package.

- `timewExecutable` is the full path to your local timewarrior installation, by default (homebrew installation), this should be `/usr/local/bin/timew` and configured out of the box.
- `logoForTag` is a dictionary that assigns custom icons to your tracked tags for a clearer and better overview. Fallback is always `Default`. E.g. if you have a tag `Client1` then you could add an icon `Client1.png` in the `icons/` subfolder and add the entry `"Client1": "Client1.png"` to `logoForTag`.

## Installation

Download the file and edit `config.json` to your wishes and system configuration.
Run
```npm
npm install
npm run package
```
Then copy the contents of the `dist` folder to your Alfred workflows folder. 

## Usage

Assign your favorite hotkey by opening the workflow in Alfred's settings (default is `Ctrl+Z`) or simply type `tw`.

Without specifying an argument, you get your total work time for today, your over-/undertime for today and for the month. Then, your most recent timecards are displayed.

There are a couple of arguments you can specify. 
For an overview and description, type `?`.
There are a few special commands which are not present as such in timewarrior, but are combinations of at least two commands:
- `split` splits the currently running timecard at the given time in two. I need this frequently when I need a new annotation, but the same tags and a seamless transition between timecards.
- `retag` removes all tags from a selected timecard and replaces it with the given tag.

## ToDo

- Provide a `.alfredworkflow` file.
- Make length of a working day configurable.
- Improve configuration of `node` executable.

## Credits

The [icon](https://www.flaticon.com/de/premium-icon/stoppuhr_4533617?term=stoppuhr&page=1&position=5&page=1&position=5&related_id=4533617&origin=search#) was created by *Good Ware* from [Flaticon](https://www.flaticon.com/de/).
