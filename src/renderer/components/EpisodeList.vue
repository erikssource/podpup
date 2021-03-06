<template>
   <div>
      <b-table v-if="episodes"
         :fields="fields"
         :items="episodes"
         :filter="filterEpisode"
         striped >
         <template slot="details" slot-scope="data">
            <b-button v-b-tooltip.hover title="Show Details" size="sm" v-on:click="data.toggleDetails" >
               <i class="fas fa-file-alt"></i>
            </b-button>
         </template>
         <template slot="title" slot-scope="data">
            <div>
               {{ data.item.title }}
               <span class="text-primary" v-if="data.item.bookmark > 0"><i class="fas fa-book"></i></span>
               <span class="text-primary" v-if="data.item.filename"><i class="fas fa-arrow-alt-circle-down"></i></span>
            </div>
            <div v-if="isDownloading(data.item)">
               <b-progress :max="100">
                  <b-progress-bar :value="downloadProgress(data.item)">
                     <strong>{{ 
                        (downloadProgress(data.item) === 0) ? "Waiting..." : (downloadProgress(data.item).toString() + '%')
                     }}</strong>
                  </b-progress-bar>
               </b-progress>
            </div>
         </template>
         <template slot="published" slot-scope="data">
            {{ formatDate(data.item.published) }}
         </template>
         <template slot="duration" slot-scope="data">
            {{ formatDuration(data.item.duration) }}
         </template>
         <template slot="action" slot-scope="data">
            <button type="button" v-b-tooltip.hover title="Play Podcast" class="btn btn-success btn-sm mb-1" v-on:click="playepisode(data.item)"><i class="fas fa-play"></i></button>
            <button v-if="data.item.filename" v-b-tooltip.hover title="Delete Download" type="button" class="btn btn-danger btn-sm mb-1" @click="deleteDownload(data.item)"><i class="fas fa-file-excel"></i></button>
            <button v-else-if="isDownloading(data.item)" class="btn btn-secondary btn-sm mb-1" disabled><i class="fas fa-download"></i></button>
            <button v-else type="button" v-b-tooltip.hover title="Download" class="btn btn-primary btn-sm mb-1" v-on:click="download(data.item)"><i class="fas fa-download"></i></button>
         </template>

         <template slot="row-details" slot-scope="data">
            <div>
            <b-button-toolbar class="mb-1">
               <b-button-group class="mx-1" size="sm">
                  <b-btn v-b-tooltip.hover title="Hide this Podcast" variant="primary" @click="hideEpisode(data.item)"><i class="fas fa-eye-slash"></i> Hide</b-btn>
               </b-button-group>
            </b-button-toolbar>
            <b-card>
               <div v-html="renderHtml(data.item.description)"></div>
            </b-card>
            </div>
         </template>
      </b-table>
   </div>
</template>

<script>
   import utils from '../common/utils'

   export default {
      name: 'episode-list',
      data() {
         return {
            fields: [
               { key: 'details', label: ''},
               { key: 'title', label: 'Title' },
               { key: 'published', label: 'Date'},
               { key: 'duration', label: 'Duration'},
               { key: 'action', label: 'Actions'}
            ]
         }
      },
      computed: {
         episodes() {
           return this.$store.state.podcasts.current_episodes;
         },
         isDownloading(episode) {
            return (episode) => this.$store.getters.isEpDownloading(episode.id);
         },
         downloadProgress(episode) {
            return (episode) => this.$store.getters.epDownloadProgress(episode.id);
         }         
      },
      methods: {
         filterEpisode(episode) {
            return !episode.hidden;
         },
         download(episode) {
            this.$store.dispatch('downloadEpisode', {
               episode: episode,
               errorCallback: (err) => {
                  this.$toasted.global.pp_error({
                     message: utils.errMsg(err)
                  })
               }
            });
         },
         playepisode(episode) {
            this.$store.dispatch('playEpisode', episode);
         },
         formatDuration(durationInSecs) {
            return utils.formatDuration(durationInSecs);
         },
         formatDate(dateString) {
            return utils.formatDateFromString(dateString);
         },
         renderHtml(value) {
            return this.$sanitize(value);
         },
         deleteDownload(episode) {
            this.$store.dispatch('deleteDownload', episode);
         },
         hideEpisode(episode) {
            this.$store.dispatch('hideEpisode', {
               episode: episode,
               errorCallback: (err) => {
                  this.$toasted.global.pp_error({
                     message: utils.errMsg(err)
                  })
               }
            });
         }
      }
   }
</script>

<style scoped>
.episodes-wrapper {
   height: 800px;
   overflow-x: hidden;
   overflow-y: auto;
}

.progress {
   background-color: #b9bcbf;
}
</style>