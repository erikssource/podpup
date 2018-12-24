import Vue from 'vue';
import parsePodcast from 'node-podcast-parser';
import request from 'request';
import Promise from 'bluebird';

import poddao from '../db/poddao';

export default {
   makeRequest(url) {
      return new Promise((resolve, reject) => {
         request(url, (err, res, data) => {
            if (err) {
               console.error('Network error', err);
               reject(err);
            }
            else {
               resolve(data);
            }
         });
      });
   },
   parseFeed(feed) {
      return new Promise((resolve, reject) => {
         parsePodcast(feed, (err, data) => {
            if (err) {
               console.error('Parsing error ', err);
               reject(err);
            }
            else {
               resolve(data);
            }
         });
      });
   },

   /* jshint ignore:start */

   async addFeed(url) {
      let feed = await this.makeRequest(url);
      let data = await this.parseFeed(feed);
      return poddao.addPodcast(data, url);
   },
   async loadFeed(podId, url) {
      let feed = await this.makeRequest(url);
      let data = await this.parseFeed(feed);
      return poddao.loadPodcast(podId, data, url);
   },
   async getFeed(url) {
      let feed = await this.makeRequest(url);
      return this.parseFeed(feed);
   },

   /* jshint ignore:end */


   updateFeed(podcast) {
      return Promise.join(poddao.getEpisodeGuids(podcast), this.getFeed(podcast.url), (eps, feed) => {
         let guids = [];
         if (eps) {
            eps.forEach((ep) => {
               guids.push(ep.guid);
            });
         }
         let tasks = [];
         if (feed) {            
            feed.episodes.forEach((ep) => {
               if (!guids.includes(ep.guid)) {
                  tasks.push(poddao.addEpisode(podcast, ep));
               }
            });
         }
         if (tasks.length > 0) {
            return Promise.all(tasks).then(() => Promise.resolve(podcast));
         }
         else {
            return Promise.resolve(podcast);
         }
      });
   }
};