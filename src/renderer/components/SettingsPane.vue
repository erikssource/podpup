<template>
   <div class="p-10">
      <div v-if="currentPodcast" >
         <p class="lead">Settings for {{ currentPodcast.title }}</p>
         <b-btn variant="danger" size="sm" @click="removePodcast(currentPodcast)">Unsubscribe</b-btn>
         <b-card class="mt-1">
            <b-card-header>
               Podcast Episodes
            </b-card-header>
            <b-card-body>
               <b-btn variant="primary" size="sm" @click="unhideEpisodes(currentPodcast)">Unhide All Episodes</b-btn>
            </b-card-body>
         </b-card>
      </div>
      <b-card v-else class="lead p-10">No Podcast Selected</b-card>
   </div>
</template>

<script>
   export default {
      name: 'settings-pane',
      data() {
         return {
            unhidetoaster: null
         }
      },
      computed: {
         currentPodcast() {
            return this.$store.state.podcasts.current_pod;
         }
      },
      methods: {
         removePodcast(pod) {
            this.$store.dispatch('removePodcast', pod);
         },
         unhideEpisodes(pod) {
            this.$data.unhidetoaster = this.$toasted.show("Unhiding episodes for " + pod.title);
            this.$store.dispatch('unhideAllEpisodes', {
               podcast: pod,
               errorCallback: (err) => {
                  if (this.$data.unhidetoaster) {
                     this.$data.unhidetoaster.goAway(0);
                  }
                  this.$toasted.global.pp_error({
                     message: utils.errMsg(err)
                  })
               },
               completeCallback: () => {
                  if (this.$data.unhidetoaster) {
                     this.$data.unhidetoaster.goAway(0);
                  }
               },
            });
         }
      }
   }
</script>

<style>
</style>