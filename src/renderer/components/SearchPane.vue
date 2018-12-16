<template>
   <div class="p-8">
      <b-card>
         <p>Add RSS Feed</p>
         <p><input class="w-100" v-model='rssfeed' placeholder="URL for RSS"></p>
         <button type="button" class="btn btn-primary" v-bind:disabled="!rssfeed" v-on:click="addFeed">Add Podcast</button>
      </b-card>
   </div>
</template>

<script>
   export default {
      name: 'search-pane',
      data() {
         return {
            rssfeed: null
         }
      },
      methods: {
         addFeed() {
            this.$store.dispatch('podAdded', this.$data.rssfeed)
         }
      }
   }
</script>

<style>
</style>