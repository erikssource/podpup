<template>
   <div>
      <b-button-toolbar class="my-1" aria-label="Toolbar with buttons">
         <b-button-group class="mx-1" size="sm">
            <b-btn v-b-tooltip.hover title="Refresh All Podcasts" variant="primary"><i class="fas fa-sync"></i> Refresh All</b-btn>                  
         </b-button-group>
         <b-button-group class="mx-1" size="sm">
            <b-btn v-b-tooltip.hover title="Display Episodes" variant="primary" @click="showEpisodes"><i class="fas fa-microphone"></i> Episodes</b-btn>
            <b-btn v-b-tooltip.hover title="Search for Podcasts" variant="primary" @click="showSearch"><i class="fas fa-search"></i> Search</b-btn>            
            <b-btn v-b-tooltip.hover title="Global Settings" variant="primary" @click="showSettings"><i class="fas fa-cog"></i> Settings</b-btn>
         </b-button-group>
      </b-button-toolbar>
   </div>
</template>

<script>
export default {
   name: 'toolbar',
   methods: {
      /*
      test() {
         console.log("Test Called");
         this.$toasted.show('An Error has occurred with the RSS Feed you entered', {
            icon : 'exclamation-circle',
            duration: 8000,
            action: {
               text: 'Dismiss',
               onClick: (e, toastObject) => {
                  toastObject.goAway(0);
               }
            }
         });
      },
      */
      show() {
         this.$modal.show('add-rss');
      },
      showEpisodes() {
         this.$store.dispatch('turnOnEpisodes');
      },
      showSearch() {
         this.$store.dispatch('turnOnSearch');
      },
      showSettings() {
         this.$store.dispatch('turnOnSettings');
      },
      showError(msg) {
         console.log("TRYING TO SHOW ERROR FROM TOOLBAR");
         this.$modal.show('err-modal', { msg: msg });
      }
   }
}

</script>

<style>
</style>