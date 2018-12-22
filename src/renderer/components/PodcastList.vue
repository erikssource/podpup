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
                     <moon-loader :size=40 v-if="waiting.includes(podcast.id)"></moon-loader>
                     <!-- <b-button v-if="waiting.includes(podcast.id)" size="sm" v-b-tooltip.hover titie="Refreshing" variant="secondary"><i class="fas fa-sync"></i></b-button> -->
                     <b-button v-else size="sm" v-b-tooltip.hover title="Refresh Podcast" variant="success" @click.stop="refreshPodcast(podcast)"><i class="fas fa-sync"></i></b-button>      
                  </div>
            </b-list-group-item>
         </b-list-group>
      </b-card>
   </section>
</template>

<script>
   import { MoonLoader } from '@saeris/vue-spinners'

   export default {
      name: 'podcast-list',
      data() {
         return {
            waiting: []
         }
      },
      components: {
         MoonLoader
      },
      computed: {
         podcasts() {
            return this.$store.state.podcasts.podcasts
         },
         selectedPodcast() {
            return this.$store.state.podcasts.current_pod
         },
         selectedPodcastId() {
            return this.$store.state.podcasts.current_pod ? this.$store.state.podcasts.current_pod.id : -1;
         }
      },
      methods: {
         selectPodcast(row) {
            this.$store.dispatch('podSelected', row)
         },
         refreshPodcast(row) {
            this.$data.waiting.push(row.id)
            this.$store.dispatch('updatePodcast', {
                  podcast: row,
                  complete: function() {
                     console.log('Complete called')
                     this.$data.waiting.splice(this.$data.waiting.indexOf(row.id), 1)
                  }.bind(this)
               })
            return false
         }
      }
   }
</script>

<style>
</style>