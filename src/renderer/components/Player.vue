<template>
   <div>
      <b-card>
         <div class="row">
            <div class="col-2">
               <div>
                  <button type="button" class="btn btn-primary" v-bind:disabled="!playingEpisode" v-on:click="playpause">{{ playstate }}</button>
               </div>
               <div v-if="playingEpisode">
                  {{ formatDuration(playingEpisode.duration) }}
               </div>
            </div>
            <div class="col">
               <p v-if="playingEpisode" class="lead">
                  {{ playingEpisode.title }}
               </p>
               <div v-if="playingEpisode" >
                  <vue-slider ref="slider" v-bind:tooltip="false" v-model="progress" @drag-start="dragStart" @drag-end="dragEnd" :min="0" :max="2000" ></vue-slider>
                  <span>{{ formatDuration(calculatedSeek) }}</span>
               </div>
            </div>
         </div>
      </b-card>
   </div>
</template>

<script>
   import path from 'path'
   import fileUrl from 'file-url'
   import { remote } from 'electron'
   import {Howl, Howler} from 'howler'
   import vueSlider from 'vue-slider-component'

   import utils from '../common/utils'
   import mediakeys from '../common/mediakeys'

   var calcProgress = function(value, total) {
      return value === 0
         ? 0
         : Math.round((value/total) * 2000)
   }

   var calcSeek = function(progress, total) {
      return progress = 0
         ? 0
         : Math.round((progress/2000) * total)
   }

   export default {
      name: 'player',
      components: {
         vueSlider
      },
      data() {
         return {
            playstate: 'Play',
            isplaying: false,
            duration: 0,
            progress: 0,
            updateTimer: null
         }
      },
      computed: {
         playingEpisode() {
            return this.$store.state.podcasts.play_episode
         },
         calculatedSeek() {
            return calcSeek(this.$data.progress, this.$data.duration)
         }
      },
      methods: {
         playpause: function(event) {
            if (this.$data.playstate === 'Play') {
               this.$data.playstate = 'Pause'
               this.$data.audioplayer.play()
            }
            else {
               this.$data.playstate = 'Play'
               this.$data.audioplayer.pause()
            }
         },
         formatDuration: function(durationInSecs) {
            return utils.formatDuration(durationInSecs)
         },
         dragStart: function() {
            if (this.$data.audioplayer) {
               console.log("Clearing Interval")
               clearInterval(this.$data.updateTimer)
               this.$data.updateTimer = null
            }
         },
         dragEnd: function() {
            if (this.$data.audioplayer) {
               let seekpoint = Math.round(((Math.max(this.$data.progress,1))/2000) * this.$data.duration)
               console.log("Setting Seekpoint: ", seekpoint)
               this.$data.audioplayer.seek(seekpoint)
               this.$data.updateTimer = setInterval(() => {
                  this.$data.progress = calcProgress(this.$data.audioplayer.seek(), this.$data.duration)
               }, 500)
            }
         }
      },
      watch: {
         playingEpisode: function(newEpisode, oldEpisode) {
            // Make sure I'm hooked up to the media key
            mediakeys.registerPlaypauseHandler((() => {
               this.playpause(null)
            }).bind(this))
            this.$data.progress = 0
            if (this.$data.updateTimer) {
               clearInterval(this.$data.updateTimer)
               this.$data.updateTimer = null
            }
            if (this.$data.audioplayer) {
               this.$data.audioplayer.unload()
               this.$data.audioplayer = null
            }
            let src = ""
            if (newEpisode.filename) {
               src = fileUrl(newEpisode.filename)
            }
            else {
               src = newEpisode.url
            }

            console.log("PLAYING: ", src)

            this.$data.audioplayer = new Howl({
               src: [src],
               preload: true,
               html5: true,
               volume: 0.7
            })
            this.$data.duration = newEpisode.duration
            this.$data.audioplayer.play()
            this.$data.isplaying = true
            this.$data.playstate = 'Pause'
            this.$data.progress = calcProgress(this.$data.audioplayer.seek(), this.$data.duration)
            this.$data.updateTimer = setInterval(() => {
               this.$data.progress = calcProgress(this.$data.audioplayer.seek(), this.$data.duration)
            }, 500)
         }
      }
   }
</script>

<style>
</style>