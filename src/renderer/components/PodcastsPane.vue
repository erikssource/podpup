<template>
  <div>
    <episode-list />
  </div>
</template>

<script>
   import EpisodeList from './EpisodeList'
   
   export default {
      name: 'podcasts-pane',
      components: {
        EpisodeList
      },
  }
</script>

<style scoped>
</style>