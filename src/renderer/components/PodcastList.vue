<template>
   <section>
      <b-card no-body header="<strong>Podcasts</strong>">
         <b-list-group flush>
            <b-list-group-item 
               v-for="podcast in podcasts"
               button
               class="d-flex justify-content-between align-items-center"
               :key="podcast.id"
               @click="selectPodcast(podcast)"
               v-bind:active="selectedPodcastId === podcast.id">
                  <span>{{ podcast.title }}</span>
                  <div>
                     <moon-loader :size=26 v-if="isRefreshing(podcast)"></moon-loader>
                     <b-button v-else size="sm" v-b-tooltip.hover title="Refresh Podcast" variant="success" @click.stop="refreshPodcast(podcast)"><i class="fas fa-sync"></i></b-button>      
                  </div>
            </b-list-group-item>
         </b-list-group>
      </b-card>
   </section>
</template>

<script>
   import { MoonLoader } from '@saeris/vue-spinners'
   import utils from '../common/utils'

   export default {
      name: 'podcast-list',
      components: {
         MoonLoader
      },
      computed: {
         podcasts() {
            return this.$store.state.podcasts.podcasts;
         },
         selectedPodcast() {
            return this.$store.state.podcasts.current_pod;
         },
         selectedPodcastId() {
            return this.$store.state.podcasts.current_pod ? this.$store.state.podcasts.current_pod.id : -1;
         },
         isRefreshing(podcast) {
            return (podcast) => this.$store.getters.isPodRefreshing(podcast.id);
         }         
      },
      methods: {         
         selectPodcast(row) {
            this.$store.dispatch('podSelected', row);
         },
         refreshPodcast(row) {
            this.$store.dispatch('updatePodcast', {
                  podcast: row,
                  errorCallback: (err) => {
                     this.$toasted.global.pp_error({
                        message: utils.errMsg(err)
                     })
                  }
               });
            return false;
         }
      }
   }
</script>

<style>
</style>