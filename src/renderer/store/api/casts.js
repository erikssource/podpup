import Vue from 'vue'
import parsePodcast from 'node-podcast-parser'
import request from 'request'
import * as Promise from 'bluebird'

import poddao from '../db/poddao'

export default {
   makeRequest(url) {
      return new Promise((resolve, reject) => {
         request(url, (err, res, data) => {
            if (err) {
               console.error('Network error', err)
               reject(err)
            }
            else {
               resolve(data)
            }
         })
      })
   },
   parseFeed(feed) {
      return new Promise((resolve, reject) => {
         parsePodcast(feed, (err, data) => {
            if (err) {
               console.error('Parsing error ', err)
               reject(err)
            }
            else {
               resolve(data)
            }
         })
      })
   },
   loadFeed(url, cb) {
      this.makeRequest(url)
         .then((feed) => this.parseFeed(feed))
         .then((data) => poddao.addPodcast(data, url, cb))
   },
   getFeed(url) {
      return this.makeRequest(url)
         .then((feed) => this.parseFeed(feed))
   },
   updateFeed(podcast) {
      return Promise.join(poddao.getEpisodeGuids(podcast), this.getFeed(podcast.url), (eps, feed) => {
         let guids = []
         if (eps) {
            eps.forEach((ep) => {
               guids.push(ep.guid)
            })
         }
         let tasks = []
         if (feed) {            
            feed.episodes.forEach((ep) => {
               console.log("GUIDS: ", guids)
               console.log("CUR GUID: ", ep.guid)
               if (!guids.includes(ep.guid)) {
                  tasks.push(poddao.addEpisode(podcast, ep))
               }
            })
         }
         if (tasks.length > 0) {
            return Promise.all(tasks).then(() => Promise.resolve(podcast))
         }
         else {
            return Promise.resolve(podcast)
         }
      })
   }
}