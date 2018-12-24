<template>
   <div class="p-10">
      <div v-if="currentPodcast" >
         <p class="lead">Settings for {{ currentPodcast.title }}</p>
         <b-button :variant="'danger'" @click="removePodcast(currentPodcast)">Unsubscribe</b-button>
      </div>
      <b-card v-else class="lead p-10">No Podcast Selected</b-card>
   </div>

</template>

<script>
   export default {
      name: 'settings-pane',
      computed: {
         currentPodcast() {
            return this.$store.state.podcasts.current_pod
         }
      },
      methods: {
         removePodcast(pod) {
            this.$store.dispatch('removePodcast', pod)
         }
      }
   }
</script>

<style>
</style>