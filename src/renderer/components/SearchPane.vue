<template>
   <div class="p-8">
      <b-card>
         <b-card-header>
            Add RSS Feed Directly
         </b-card-header>
         <b-card-body>
            <p><input class="w-100" v-model='rssfeed' placeholder="URL for RSS"></p>
            <button type="button" class="btn btn-primary" v-bind:disabled="!rssfeed" v-on:click="addFeed">Add Podcast</button>
         </b-card-body>
      </b-card>
      <b-card>
         <b-card-header>
            Search For Podcasts
         </b-card-header>
         <b-card-body>
            <p><input class="w-100" v-model='searchterms' placeholder="Search Term(s)"></p>
            <button type="button" class="btn btn-primary" v-bind:disabled="!searchterms" @click="searchForFeeds">Search</button>
         </b-card-body>
      </b-card>
      <b-card v-if="searchresults">
         <b-card-header>
            Search Results
         </b-card-header>
         <b-card-body>
            <b-list-group flush>
               <b-list-group-item v-for="searchresult in searchresults" :key="searchresult.id">
                  <b-media>
                     <b-img slot="aside" width="100" alt="pod image" v-bind:src="searchresult.image" />
                     <p class="lead">{{ searchresult.name }}</p>
                     <button type="button" class="btn btn-success" @click="subscribe(searchresult)">Subscribe</button>
                  </b-media>
               </b-list-group-item>
            </b-list-group>
         </b-card-body>
      </b-card>
   </div>
</template>

<script>
   export default {
      name: 'search-pane',
      data() {
         return {
            rssfeed: null,
            searchterms: null,
            searchresults: null
         }
      },
      methods: {
         addFeed() {
            this.$store.dispatch('podAdded', this.$data.rssfeed)
         },
         subscribe(searchresult) {
            this.$store.dispatch('podAdded', searchresult.url)
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
                        name: result.collectionName,
                        image: result.artworkUrl100,
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