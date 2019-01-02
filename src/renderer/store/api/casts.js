import Vue from 'vue';
import parsePodcast from 'node-podcast-parser';
import request from 'request';

import podpupdao from '../db/podpupdao';

export default {
   addFeed(url, errorCallback, completeCallback) {
      request( url, (err, response, data) => {
         if (err) {
            console.warn("Request error during addFeed(): ", err);
            errorCallback("Request error for " + url);
         }
         else {
            parsePodcast(data, (err, feed) => {
               if (err) {
                  console.warn("Parse error during addFeed(): ", err);
                  errorCallback("Parse error reading feed from " + url);
               }
               else {
                  podpupdao.addPodcast(feed, url).then((podcast) => {
                     completeCallback(podcast);
                  })
                  .catch((err) => { 
                     console.warn("Save error during addFeed(): ", err);
                     errorCallback("Error saving feed data");
                  });
               }
            });
         }
      });
   },

   loadFeed(podId, url, errorCallback, completeCallback) {
      request( url, (err, response, data) => {
         if (err) {
            console.warn("Request error during addFeed(): ", err);
            errorCallback("Request error for " + url);
         }
         else {
            parsePodcast(data, (err, feed) => {
               if (err) {
                  console.warn("Parse error during addFeed(): ", err);
                  errorCallback("Parse error reading feed from " + url);
               }
               else {
                  podpupdao.loadPodcast(podId, feed, url).then((podcast) => {
                     completeCallback(podcast);
                  })
                  .catch((err) => { 
                     console.warn("Save error during addFeed(): ", err);
                     errorCallback("Error saving feed data");
                  });
               }
            });
         }
      });
   },

   updateFeed(podcast, errorCallback, completeCallback) {
      request( podcast.url, (err, response, data) => {
         if (err) {
            console.warn("Request error during updateFeed(): ", err);
            errorCallback("Could not refresh " + podcast.title);
         }
         else {
            parsePodcast(data, (err, feed) => {
               if (err) {
                  console.warn("Parse error during updateFeed(): ", err);
                  errorCallback("Parse error refreshing " + podcast.title);
               }
               else {
                  this.syncEpisodes(podcast, feed, errorCallback, completeCallback);
               }
            });
         }
      });
   },

   syncEpisodes(podcast, feed, errorCallback, completeCallback) {
      podpupdao.getEpisodeGuids(podcast).then((guids) => {
         let episodes = [];
         if (feed) {            
            feed.episodes.forEach((ep) => {
               if (!guids.includes(ep.guid)) {
                  episodes.push(ep);
               }
            });
         }
         console.log("NEW EPISODES: ", episodes.length);
         if (episodes.length > 0) {
            podpupdao.addEpisodes(podcast.id, episodes)
               .then(() => completeCallback(episodes.length))
               .catch((err) => {
                  console.warn("Error adding episodes during syncEpisodes(): ", err);
                  errorCallback('Error Adding Episodes To Database');
               });
         }
         else {
            completeCallback(0);
         }
      })
      .catch((err) => {
         console.warn("Error getting episode guids during syncEpisodes(): ", err);
         errorCallback("Could not retrieve existing episode data.");
      });
   }
};