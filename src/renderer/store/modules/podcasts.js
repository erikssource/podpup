import Vue from 'vue';
import casts from '../api/casts';
import poddao from '../db/poddao';
import downloader from '../../common/downloader';

const state = {
   podcasts: [],
   podcast_refresh: {},
   episodes: null,
   episode_progress: {},
   current_episodes: null,
   current_pod: null,
   play_episode: null
};

const getters = {
   isPodRefreshing: (state) => (podId) => {
      return state.podcast_refresh.hasOwnProperty(podId) ? state.podcast_refresh[podId] : false;
   },

   isEpDownloading: (state) => (epId) => {
      return state.episode_progress.hasOwnProperty(epId);
   },

   epDownloadProgress: (state) => (epId) => {
      return state.episode_progress[epId];
   }
};

const actions = {
   initialize ({commit}) {
      poddao.getAllPods().then((pods) => {
         commit('loadPodcasts', pods);
      });
   },
   updatePodcast({commit, state}, podcast) {
      commit('setPodStateRefreshing', podcast);
      casts.updateFeed(podcast)
         .then((pod) => {            
            if (state.current_pod && state.current_pod.id === pod.id) {
               poddao.getAllEpisodes(podcast).then((episodes) => {
                  commit('setPodStateNotRefreshing', podcast);
               });
            }
            else {
               commit('setPodStateNotRefreshing', podcast);
            }
         });
   },
   feedAdded ({commit}, url) {
      casts.addFeed(url).then((podcast) => {
         commit('addPodcast', podcast);
      });
   },
   podAdded ({commit}, payload) {
      poddao.addPodcastStub(payload.title, payload.lastupdate, payload.url)
         .then((podcast) => {     
            console.log("POD ADDED: ", podcast);
            commit('addPodcast', podcast);
            commit('setPodStateRefreshing', podcast);
            return casts.loadFeed(podcast.id, payload.url);
         })
         .then((podcast) => {
            commit('setPodStateNotRefreshing', podcast);
         });
   },
   podSelected ({commit}, podcast) {
      // TODO: Handling selecting nothing
      poddao.getPodcast(podcast)
         .then((pod) => {
            commit('setCurrentPod', pod);
            commit('setEpisodes', pod.Episodes);
         });
   },
   playEpisode ({commit}, episode) {
      commit('setPlayingEpisode', episode);
   },
   updateBookmark({commit}, payload) {
      commit('updateEpisodeBookmark', {episode: payload.episode, bookmark: payload.position});
   },
   downloadEpisode({commit, state}, episode) {
      commit('setEpisodeStateDownloading', episode);
      downloader.downloadEpisode(
         state.current_pod, 
         episode,
         (progress) => {
            commit('setEpisodeStateProgress', { episode: episode, progress: progress });
         },
         (fileName) => {
            commit('setEpisodeStateProgress', { episode: episode, progress: 100 });
            commit('updateEpisodeFile', { episode: episode, filename: fileName} );
            commit('setEpisodeStateNotDownloading', episode);
      });
   },
   deleteDownload({commit}, episode) {
      downloader.deleteDownload(episode.filename);
      commit('updateEpisodeFile', { episode: episode, filename: null} );
   },
   removePodcast({commit, state}, podcast) {
      poddao.removePodcast(podcast)
         .then(() => poddao.getAllPods())
         .then((pods) => {
            commit('loadPodcasts', pods);
            if (podcast.id === state.current_pod.id) {
               commit('setCurrentPod', null);
               commit('setEpisodes', null);
            }
         });
   }
};

const mutations = {
   addPodcast(state, feed) {
      state.podcasts.push({id: feed.id, title: feed.title, lastupdate: feed.lastupdate, url: feed.url});
   },
   loadPodcasts(state, pods) {
      state.podcasts = pods;
   },
   setCurrentPod(state, podcast) {
      state.current_pod = podcast;
   },
   setEpisodes(state, episodes) {
      state.current_episodes = episodes;
   },
   updateEpisodeBookmark(state, payload) {
      if (state.current_episodes) {
         state.current_episodes.forEach((ep) => {
            if (payload.episode.id === ep.id) {               
               ep.bookmark = payload.bookmark;
               poddao.updateEpisode(ep.id, {bookmark: payload.bookmark});
               return;
            }
         });
      }
   },
   updateEpisodeFile(state, payload) {
      poddao.updateEpisode(payload.episode.id, {filename: payload.filename});
      if (state.current_episodes) {
         state.current_episodes.forEach((ep) => {
            if (payload.episode.id === ep.id) {               
               ep.filename = payload.filename;               
               return;
            }
         });
      }
   },
   setPlayingEpisode(state, episode) {
      state.play_episode = episode;
   },
   setPodStateRefreshing(state, podcast) {
      if (state.podcast_refresh.hasOwnProperty(podcast.id)) {
         state.podcast_refresh[podcast.id] = true;
      }
      else {
         Vue.set(state.podcast_refresh, podcast.id, true);
      }
   },
   setPodStateNotRefreshing(state, podcast) {
      if (state.podcast_refresh.hasOwnProperty(podcast.id)) {
         Vue.delete(state.podcast_refresh, podcast.id);
      }
   },
   setEpisodeStateDownloading(state, episode) {
      if (state.episode_progress.hasOwnProperty(episode.id)) {
         state.episode_progress[episode.id] = 0;
      }
      else {
         Vue.set(state.episode_progress, episode.id, 0);
      }
   },
   setEpisodeStateNotDownloading(state, episode) {
      if (state.episode_progress.hasOwnProperty(episode.id)) {
         Vue.delete(state.episode_progress, episode.id);
      }
   },
   setEpisodeStateProgress(state, payload) {
      if (state.episode_progress.hasOwnProperty(payload.episode.id)) {
         state.episode_progress[payload.episode.id] = payload.progress;
      }
   }
};

export default {
   state,
   getters,
   actions,
   mutations
};