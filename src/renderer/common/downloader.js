import request from 'request';
import progress from 'request-progress';
import filenamify from 'filenamify';
import fs from 'fs';
import path from 'path';

import config from '../store/modules/config';
import utils from './utils';
import { Task } from './task';
import { ProcessManager } from './process';

let downloadProcessor = new ProcessManager(config.state.concurrentDownloads);

let doDownload = function(payload) {
   return new Promise((resolve, reject) => {
      let {fileName, episode, progressCallback} = payload;

      progress(request(episode.url))
         .on('progress', (state) => {
            progressCallback(Math.round(100 * state.percent));
         })
         .on('error', (err) => {
            reject(err);
         })
         .pipe(fs.createWriteStream(fileName))
         .on('error', (err) => {
            reject(err);
         })
         .on('finish', () => {
            resolve(fileName);
         });
   });
};

export default {
   downloadEpisode(feed, episode, progressCallback, completeCallback) {
      let fileName = path.format({
         dir: this.getFeedPath(feed),
         name: filenamify(episode.title),
         ext: utils.mimeToExt(episode.mimetype)
      });
      let task = new Task(
         doDownload,
         {
            fileName: fileName,
            episode: episode,
            progressCallback: progressCallback
         },
         (err) => console.error("Download Error: ", err),
         (result) => {
            console.log("Download Finished: ", result);
            completeCallback(result);
         },
         () => console.log("Download Started: ", episode.title)
      );
      downloadProcessor.addTask(task);
   },
   getFeedPath(feed) {
      let pathName = path.join(config.state.poddir, filenamify(feed.title, {replacement: '-'}));
      if (!fs.existsSync(pathName)) {
         fs.mkdirSync(pathName, {recursive: true});
      }
      return pathName;
   },
   deleteDownload(filename) {
      if (fs.existsSync(filename)) {
         fs.unlinkSync(filename);
      }
   }
};
