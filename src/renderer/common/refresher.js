import { ProcessManager } from "./process";
import { Task } from './task';
import casts from '../store/api/casts';
import config from '../store/modules/config';
import printf from 'printf';

let refreshProcessor = new ProcessManager(config.state.concurrentRefreshes);

let doRefresh = function(podcast) {
   return new Promise((resolve, reject) => {
         casts.updateFeed(podcast, 
            (err) => {
               reject(err);
            },
            (added) => {
               resolve(added);
            });
   });
};

export default {
   refreshPodcast(podcast, errorCallback, completeCallback) {
      let task = new Task(
         doRefresh,
         podcast,
         (err) => {
            errorCallback(err);
         },
         (added) => {
            console.log(printf("%s refreshed with %d episodes added", podcast.title, added));
            completeCallback(added);
         },
         () => {
            console.log(printf("%s refresh starting", podcast.title));
         }
      );
      refreshProcessor.addTask(task);
   }
};