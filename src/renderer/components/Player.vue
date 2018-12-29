<template>
   <div class="pp-player-inset">
      <div class="row">
         <div class="col-2">
            <div>           
               <span class="mr-1" v-if="playingEpisode">{{ formatDuration(playingEpisode.duration) }}</span>
               <button type="button" class="btn btn-success" v-if="playingEpisode" v-on:click="playpause"><i class='fas' :class="playstate"></i></button>
               <button type="button" class="btn btn-secondary" v-else disabled><i class='fas' :class="playstate"></i></button>
            </div>
         </div>
         <div class="col">
            <p v-if="playingEpisode">
               <span class="go-left"><strong>{{ playingEpisode.title }}</strong></span>
               <span v-if="dragging" class="go-right">{{ formatDuration(calculatedSeek)}}</span>
               <span v-else class="go-right">{{ formatDuration(seek) }}</span>
            </p>
            <div v-if="playingEpisode" >
               <vue-slider ref="slider" v-bind:tooltip="false" v-model="progress" @drag-start="dragStart" @drag-end="dragEnd" :min="0" :max="2000" ></vue-slider>
            </div>
            <div v-else>
               <span class="lead">Nothing Playing</span>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
   import path from 'path';
   import fileUrl from 'file-url';
   import { remote } from 'electron';
   import {Howl, Howler} from 'howler';
   import vueSlider from 'vue-slider-component';

   import utils from '../common/utils';

   var calcProgress = function(value, total) {
      return value === 0
         ? 0
         : Math.round((value/total) * 2000);
   }

   var calcSeek = function(progress, total) {
      return progress = 0
         ? 0
         : Math.round((progress/2000) * total);
   }

   const play = 'fa-play';
   const pause = 'fa-pause';

   export default {
      name: 'player',
      components: {
         vueSlider
      },
      data() {
         return {
            playstate: play,
            isplaying: false,
            duration: 0,
            progress: 0,
            soundid: 0,
            seek: 0,
            dragging: false,
            updateTimer: null
         }
      },
      mounted() {
         this.$electron.ipcRenderer.on('mkplay', (event) => {
            this.playpause(null)
         });
      },
      computed: {
         playingEpisode() {
            return this.$store.state.podcasts.play_episode;
         },
         calculatedSeek() {
            return calcSeek(this.$data.progress, this.$data.duration);
         }
      },
      methods: {
         playpause: function(event) {
            if (this.$data.isplaying) {
               if (this.$data.playstate === play) {
                  this.$data.playstate = pause;
                  this.$data.soundid = this.$data.audioplayer.play(this.$data.soundid);
               }
               else {
                  this.$data.playstate = play;
                  this.$data.audioplayer.pause(this.$data.soundid);
               }
            }
         },
         formatDuration: function(durationInSecs) {
            return utils.formatDuration(durationInSecs);
         },
         dragStart: function() {
            if (this.$data.audioplayer) {
               this.$data.dragging = true;
               console.log("Clearing Interval");
               clearInterval(this.$data.updateTimer);
               this.$data.updateTimer = null;
            }
         },
         dragEnd: function() {
            if (this.$data.audioplayer) {
               this.$data.dragging = false;
               let seekpoint = Math.round(((Math.max(this.$data.progress,1))/2000) * this.$data.duration);
               console.log("Setting Seekpoint: ", seekpoint);
               this.$data.audioplayer.seek(seekpoint, this.$data.soundid);
               this.$data.seek = seekpoint;
               this.$data.updateTimer = setInterval(() => {
                  this.$data.seek = this.$data.audioplayer.seek();
                  this.$data.progress = calcProgress(this.$data.seek, this.$data.duration);
                  this.$store.dispatch('updateBookmark', { episode: this.$store.state.podcasts.play_episode, position: this.$data.seek});
               }, 500);
            }
         }
      },
      watch: {
         playingEpisode: function(newEpisode, oldEpisode) {
            if (oldEpisode && newEpisode.id === oldEpisode.id) {
               return;
            }
            this.$data.progress = 0;
            if (this.$data.updateTimer) {
               clearInterval(this.$data.updateTimer);
               this.$data.updateTimer = null;
            }
            if (this.$data.audioplayer) {
               this.$data.audioplayer.unload();
               this.$data.audioplayer = null;
            }
            let src = "";
            if (newEpisode.filename) {
               src = fileUrl(newEpisode.filename);
            }
            else {
               src = newEpisode.url;
            }

            console.log("PLAYING: ", src);

            this.$data.audioplayer = new Howl({
               src: [src],
               preload: true,
               html5: true,
               volume: 0.9
            })

            let seekpoint = newEpisode.bookmark;
            if (seekpoint > (newEpisode.duration - 30)) {
               seekpoint = 0;
            }

            this.$data.duration = newEpisode.duration;
            this.$data.soundid = this.$data.audioplayer.play();
            this.$data.audioplayer.seek(seekpoint, this.$data.soundid);
            this.$data.isplaying = true;
            this.$data.playstate = pause;
            this.$data.progress = calcProgress(seekpoint, this.$data.duration);
            this.$data.updateTimer = setInterval(() => {
               let seekvalue = this.$data.audioplayer.seek();
               if ((typeof seekvalue) === 'number') {
                  this.$data.seek = seekvalue;
                  this.$data.progress = calcProgress(this.$data.seek, this.$data.duration);
                  this.$store.dispatch('updateBookmark', { episode: this.$store.state.podcasts.play_episode, position: this.$data.seek});
               }
            }, 500);
         }
      }
   }
</script>

<style scoped>
   .pp-player-inset {
      padding-top: 20px;
      padding-right: 20px;
   }
</style>