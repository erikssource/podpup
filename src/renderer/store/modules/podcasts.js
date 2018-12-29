import Vue from 'vue';
import casts from '../api/casts';
import poddao from '../db/poddao';
import downloader from '../../common/downloader';
import refresher from '../../common/refresher';

const state = {
   podcasts: [],
   podcast_refresh: {},
   episodes: null,
   episode_progress: {},
   current_episodes: null,
   current_pod: null,
   play_pod: null,
   play_episode: null,
   adding_rss_feed: false,
   searching_for_podcasts: false
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
      poddao.getAllPods().then(
         (pods) => { commit('loadPodcasts', pods); },
         (err) => {
            console.warn("Error during initialize(): ", err);
            throw err;
         } 
      );
   },
   updateAllPodcasts({dispatch}, errorCallback) {
      poddao.getAllPods().then((pods) => {
         pods.forEach((pod) => {
            dispatch('updatePodcast', {
               podcast: pod,
               errorCallback: errorCallback
            });
         });
      })
      .catch((err) => {
         console.error(err);
         errorCallback("Could not load podcasts");
      });
   },
   updatePodcast({commit, state}, payload) {
      let { podcast, errorCallback } = payload;

      commit('setPodStateRefreshing', podcast);

      refresher.refreshPodcast(
         podcast,
         (err) => {
            commit('setPodStateNotRefreshing', podcast);
            errorCallback(err);
         },
         (count) => {
            if (state.current_pod && state.current_pod.id === podcast.id) {
               poddao.getAllEpisodes(podcast).then((episodes) => {
                  state.current_episodes = episodes;
                  commit('setPodStateNotRefreshing', podcast);
               });
            }
            else {
               commit('setPodStateNotRefreshing', podcast);
            }
         }
      );
   },
   feedAdded ({commit}, payload) {
      casts.addFeed(payload.rssfeed, 
         (err) => {
            payload.errorCallback(err);
         },
         (podcast) => {
            commit('addPodcast', podcast);
         });
   },
   podAdded ({commit}, payload) {
      poddao.addPodcastStub(payload.title, payload.lastupdate, payload.url)
         .then((podcast) => {
            console.log("Podcast Stub Added: ", podcast);
            commit('addPodcast', podcast);
            commit('setPodStateRefreshing', podcast);
            casts.loadFeed(podcast.id, payload.url,
               (err) => {
                  commit('setPodStateNotRefreshing', podcast);
                  payload.errorCallback("Unable to refresh podcast from " + payload.url);
               },
               (pod) => {
                  commit('setPodStateNotRefreshing', pod);
               });
         })
         .catch((err) => {
            console.warn("Error adding podcast stub: ", err);
            payload.errorCallback("Unable to save podcast " + payload.title);
         });
   },
   podSelected ({commit}, podcast) {
      // TODO: Handling selecting nothing
      poddao.getPodcast(podcast)
         .then((pod) => {
            commit('setCurrentPod', pod);
            commit('setEpisodes', pod.Episodes);
         },
         (err) => {
            console.log("Error selecting podcast: ", err);
            throw err;
         });
   },
   playEpisode ({commit, state}, episode) {
      commit('setPlayingEpisode', {
         podcast: state.current_pod,
         episode: episode
      });
   },
   updateBookmark({commit}, payload) {
      commit('updateEpisodeBookmark', {episode: payload.episode, bookmark: payload.position});
   },
   downloadEpisode({commit, state}, payload) {
      let {episode, errorCallback} = payload;
      commit('setEpisodeStateDownloading', episode);

      downloader.downloadEpisode(
         state.current_pod,
         episode,
         (progress) => {
            commit('setEpisodeStateProgress', { episode: episode, progress: progress });
         },
         (err) => {
            commit('setEpisodeStateNotDownloading', episode);
            errorCallback("Error downloading episode " + episode.title);
         },
         (fileName) => {
            commit('setEpisodeStateProgress', { episode: episode, progress: 100 });
            commit('updateEpisodeFile', { episode: episode, filename: fileName} );
            commit('setEpisodeStateNotDownloading', episode);
         }
      );
   },
   deleteDownload({commit}, episode) {
      downloader.deleteDownload(episode.filename);
      commit('updateEpisodeFile', { episode: episode, filename: null} );
   },
   unhideAllEpisodes({commit, state}, payload) {
      poddao.unhideAllEpisodes(payload.podcast).then((data) => {
         if (state.current_pod.id === payload.podcast.id) {
            poddao.getAllEpisodes(state.current_pod).then((episodes) => {
               commit('setEpisodes', episodes);
               payload.completeCallback();
            })
            .catch((err) => {
               payload.errCallback("Unable to reload episodes for " + payload.podcast.title);
            });
         }
         else {
            payload.completeCallback();
         }
      })
      .catch((err) => {
         payload.errorCallback("Unable to unhide episodes for " + payload.podcast.title);
      });
   },
   hideEpisode({commit}, payload) {
      poddao.updateEpisode(payload.episode.id, {hidden: true}).then((episode) => {
         commit('hideEpisode', payload.episode);
      })
      .catch((err) => {
         payload.errorCallback("Unable to hide episode");
      });
   },
   removePodcast({commit, state}, podcast) {
      poddao.removePodcast(podcast)
         .then(
            () => poddao.getAllPods(),
            (err) => {
               console.error("Error while removing podcast: ", err);
               throw err;
            })
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
   hideEpisode(state, episode) {
      if (state.current_episodes) {
         state.current_episodes.forEach((ep) => {
            if (episode.id === ep.id) {
               ep.hidden = true;               
               return;
            }
         });
      }
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
   setPlayingEpisode(state, payload) {
      let {podcast, episode} = payload;
      state.play_pod = podcast;
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