<template>
   <section>
      <b-card no-body header="<strong>Podcasts</strong>">
         <b-list-group flush>
            <b-list-group-item 
               v-for="podcast in podcasts" 
               class="d-flex justify-content-between align-items-center"
               :key="podcast.id"
               v-bind:active="selectedPodcastId === podcast.id">
                  <span @click="selectPodcast(podcast)">{{ podcast.title }}</span>
                  <b-button size="sm" variant="outline-success" @click="refreshPodcast(podcast)"><i class="fas fa-sync"></i></b-button>      
            </b-list-group-item>
         </b-list-group>
      </b-card>
   </section>
</template>

<script>
   export default {
      name: 'podcast-list',
      data() {
         return {}
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
            this.$store.dispatch('updatePodcast', row)
            return false
         }
      }
   }
</script>

<style>
</style>