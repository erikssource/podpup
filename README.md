[![Travis Build Status](https://travis-ci.org/erikssource/podpup.svg?branch=master)](https://travis-ci.org/erikssource/podpup) [![Build status](https://ci.appveyor.com/api/projects/status/rdeyj0awt2np3btq?svg=true)](https://ci.appveyor.com/project/erikssource/podpup)

# podpup

A loyal podcast fetcher

[See the Podpup website for usage.](https://erikssource.github.io/podpup)

#### Build Setup

``` bash
# install dependencies
npm install

# rebuild better-sqlite3
./node_modules/.bin/electron-rebuild -w better-sqlite3

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


```
## Features
As a project that has just started, there isn't a lot of functionality yet, but if you want to just subscribe, download, and play podcasts, then it is useable. The working features are:

* Subscribe to podcast feeds using RSS address
* Search for podcasts to add
* Display available episodes with options to play or download
* See episode descriptions
* Play podcasts (via streaming or from the downloaded file)
* Update podcasts to see new episodes
* Drag progress slider to seek to a new playback position
* Bookmarks last location in every episode listened to
* Hide individual episodes

## Warning
This project is at the very early stages, there will be bugs, error-handling is not sorted, and data created by this version will likely not migrate to future versions.

## The podpup directory
One of the goals of podpup is to keep things simple. When the application starts for the first time, it will create or use the directory 'podpup' in your home directory. This location is currently hardcoded but it will be configurable as the application is developed. Everything the application needs lives in this directory including downloaded files organized in folders with everything named in a human-friendly manner. If you want to move podpup to another computer, just move this directory and everything will be the same as it was.

## Roadmap
There is a lot of work ahead. The goal is to create a podcast fetcher and player that works the way you want it work. That means the ability have per feed settings for how often to check for new episodes, when to download episodes, how to name the downloads, how long downloads should be kept, and how many episodes should be shown. Sometimes you want to download every episode, but may for a news-related podcast you only want to download the last two and throw away anything older. That's the idea, though there is a lot of refinement and features to make things better in general.

The next few feature goals are:
* ~~Get podpup working with media keys (might already work on Windows, haven't tried it)~~
* ~~Bookmarking (podcasts will resume at the same spot you stopped listening)~~
* ~~Searching for feeds using iTunes~~
* More error handling (in progress)
* ~~Icons to show episodes that have been bookmarked or downloaded~~
* ~~Tooltips~~
* Support for background jobs. (in progress)
* ~~Limit concurrent downloads.~~
* ~~Fixed position for player in UI (don't let it scroll offscreen)~~
* Add setting for feed checking interval
* Add setting for downloading strategy
* UI feedback when loading episodes from DB
* Allow canceling of downloads
* Allow limiting number of episodes shown (in progress)
* ~~Allow hiding episodes~~
* Allow detached episodes (no longer in feed, but downloaded)
* Indicator to show a podcast has new content
* ~~Better looking UI~~
* Queue podcasts to play
* Dark theme
* Bug fixes, bug fixes, bug fixes
* Selection of data directory location (can be configured, but not in UI yet)
* Downloaded episode naming options
* ~~Move search UI to more logical location~~
* User guide
...and more

---

This scaffolding for this project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8fae476](https://github.com/SimulatedGREG/electron-vue/tree/8fae4763e9d225d3691b627e83b9e09b56f6c935) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
