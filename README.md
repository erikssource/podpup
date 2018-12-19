# podpup

A loyal podcast fetcher

#### Build Setup

``` bash
# install dependencies
npm install

# rebuild sqlite3
./node_modules/.bin/electron-rebuild -w sqlite3

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


```
## Features
As a project that has just started, there isn't a lot of functionality yet, but if you want to just subscribe, download, and play podcasts, then it is useable. The working features are:

* Subscribe to podcast feeds using RSS address
* Display available episodes with options to play or download
* See episode descriptions
* Play podcasts (via streaming or from the downloaded file)
* Update podcasts to see new episodes
* Drag progress slider to seek to a new playback position

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
* More error handling
* Icons to show episodes that have been bookmarked or downloaded
* Support for background jobs.
* Limit concurrent downloads.
* Fixed position for player in UI (don't let it scroll offscreen)
* Add setting for feed checking interval
* Add setting for downloading strategy
* Better UI feedback
* Allow canceling of downloads
* Allow limiting number of episodes shown
* Allow hiding episodes
* Allow detached episodes (no longer in feed, but downloaded)
* Indicator to show a podcast has new content
* Better looking UI
* Queue podcasts to play
* Dark theme
...and more

---

This scaffolding for this project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8fae476](https://github.com/SimulatedGREG/electron-vue/tree/8fae4763e9d225d3691b627e83b9e09b56f6c935) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
