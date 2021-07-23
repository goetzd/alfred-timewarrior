# Timewarrior for Alfred

Get an overview over your latest tracked times in [timewarrior](https://timewarrior.net) and edit them easily.

## Requirements

You need to have `node` installed and accessable via the `node` command.
(In case it is not, find out where your desired local `node` executable is located and replace `node` in the
file `execute.sh` with that path).

## Configuration

`alfred-timewarrior` comes with a default configuration with good chances that it works out of the box on your Mac.

This default configuration assumes that you either installed `timew` using [Homebrew](https://brew.sh) or your installed
it any other way to the path `/usr/local/bin/timew`.

If this is not the case, or you want to adapt `alfred-timewarrior` to your needs, you can customize it as follows:
In your home directory, create a directory `.alfred-timewarrior`:

```shell
mkdir ~/.alfred-timewarrior 
```

In this folder, create a file `alfred-timewarrior.json` with the following content.:

```json
{
  "timewExecutable": "/usr/local/bin/timew",
  "granularityInMinutes": "1",
  "logoForTag": {
    "<tag>": "<iconPathRelativeToAlfredTimewarriorFolder>"
  }
}
```

This file provides a couple of options:

- `timewExecutable` is the path to your timewarrior executable. Set this only if the default doesn't work out of the
  box.
- `granularityInMinutes` allows you to set a granularity of timestamps that is respected for default timestamps and in
  other places of `alfred-timewarrior`. The default is `1`, meaning that timestamps are by default rounded to one
  minute. Why would you use this? For my day to day projects, I am required to only book times with a granularity of
  three minutes because this converts easily into decimal numbers with a precision of two (e.g. 3 minutes = 0.05 hours).
- `logoForTag` contains a map of tags to images/icons on your harddrive. This means that if you want specific icons for
  different clients/projects/etc. it is easy to define them here. The value must be a relative(!) path from inside
  the `~/.alfred-timewarrior` folder. I.e. if you have an icon `~/.alfred-timewarrior/icon/client1.png` which should be
  used for the Tag `Client1`, you should add the line
  ```json
  "logoForTag": {
    "Client1": "icon/client1.png"
  }
  ```
  If a tag is not found in this list, the fallback is always the `alfred-timewarrior` icon. You can, however, also
  define your own default icon by defining a logo for `"DefaultIcon"`.

## Installation

Clone the package and run

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
- Improve configuration of `node` executable.

## Credits

The [icon](https://www.flaticon.com/de/premium-icon/stoppuhr_4533617?term=stoppuhr&page=1&position=5&page=1&position=5&related_id=4533617&origin=search#) was created by *Good Ware* from [Flaticon](https://www.flaticon.com/de/).
