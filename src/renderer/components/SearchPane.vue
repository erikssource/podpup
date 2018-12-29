<template>
   <div>
      <b-card class="m-1">
         <b-card-header>
            Add RSS Feed Directly
         </b-card-header>
         <b-card-body>

            <div class="mb-1"> 
               <span v-if="invalidRss" class="text-danger">Invalid URL for RSS</span>
               <input class="w-100" v-model='rssfeed' @keyup="validateRss" placeholder="Full URL for RSS Feed">
            </div>
            <button type="button" class="btn btn-primary" v-bind:disabled="!rssfeed" v-on:click="addFeed">Add Podcast</button>
         </b-card-body>
      </b-card>
      <b-card class="m-1">
         <b-card-header>
            Search For Podcasts
         </b-card-header>
         <b-card-body>
            <p><input class="w-100" v-model='searchterms' placeholder="Search Term(s)"></p>
            <button type="button" class="btn btn-primary" v-bind:disabled="!searchterms" @click="searchForFeeds">Search</button>
         </b-card-body>
      </b-card>
      <b-card class="m-1" v-if="searchresults">
         <b-card-header>
            Search Results
         </b-card-header>
         <b-card-body>
            <b-list-group flush>
               <b-list-group-item v-for="searchresult in searchresults" :key="searchresult.id">
                  <b-media>
                     <b-img slot="aside" width="100" alt="pod image" v-bind:src="searchresult.image" />
                     <p class="lead">{{ searchresult.title }}</p>
                     <button type="button" class="btn btn-success" @click="subscribe(searchresult)">Subscribe</button>
                  </b-media>
               </b-list-group-item>
            </b-list-group>
         </b-card-body>
      </b-card>
   </div>
</template>

<script>
   import validator from 'validator';
   import utils from '../common/utils';

   export default {      
      name: 'search-pane',
      data() {
         return {
            invalidRss: false,
            rssfeed: null,
            searchterms: null,
            searchresults: null
         }
      },
      methods: {
         validateRss(event) {
            if (this.$data.rssfeed) { 
               this.$data.invalidRss = !validator.isURL(this.$data.rssfeed);
               if (event.keyCode === 13) {
                  this.addFeed();
               }
            }
            else {
               this.$data.invalidRss = false;
            }
         },
         addFeed() {
            if (this.$data.rssfeed && !this.$data.invalidRss) {
               this.$store.dispatch('feedAdded', {
                  rssfeed: this.$data.rssfeed,
                  errorCallback: (err) => {
                     this.$toasted.global.pp_error({
                        message: utils.errMsg(err)
                     })
                  }
               });                  
            }
         },
         subscribe(searchresult) {
            this.$store.dispatch('podAdded', {
               title: searchresult.title,
               lastupdate: searchresult.lastupdate,
               url: searchresult.url,
               errorCallback: (err) => {
                  this.$toasted.global.pp_error({
                     message: utils.errMsg(err)
                  })
               }
            })
            let index = this.$data.searchresults.indexOf(searchresult)
            if (index >= 0) {
               this.$data.searchresults.splice(index, 1);
            }
         },
         searchForFeeds() {
            console.log("Seaching...")
            var itunesPodcasts = require('itunes-podcasts')
            itunesPodcasts.getPodcasts(this.$data.searchterms).then((response) => {
               if (response && response.resultCount > 0) {
                  console.log("RESPONSE: ", response)
                  let data = []
                  let idx = 0
                  response.results.forEach((result) => {
                     data.push({
                        id: idx,
                        title: result.collectionName,
                        image: result.artworkUrl100,
                        lastupdate: result.releaseDate,
                        url: result.feedUrl
                     })
                     idx++
                  })
                  this.$data.searchresults = data
               }
               else {
                  this.$data.searchresults = null
               }
            })
         }
      }
   }
</script>

<style>
</style>