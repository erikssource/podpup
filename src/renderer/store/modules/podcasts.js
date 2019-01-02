import Vue from 'vue';
import casts from '../api/casts';
import podpupdao from '../db/podpupdao';
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
   searching_for_podcasts: false,
   loading_episodes: false
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
      podpupdao.getAllPods().then(
         (pods) => { commit('loadPodcasts', pods); },
         (err) => {
            console.warn("Error during initialize(): ", err);
            throw err;
         } 
      );
   },
   updateAllPodcasts({dispatch}, errorCallback) {
      podpupdao.getAllPods().then((pods) => {
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
               podpupdao.getAllEpisodes(podcast).then((episodes) => {
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
      podpupdao.addPodcastStub(payload.title, payload.lastupdate, payload.url)
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
      podpupdao.getPodcastFromStub(podcast)
         .then((pod) => {
            commit('setCurrentPod', pod);
            commit('setLoadingEpisodes', true);
            podpupdao.getAllEpisodes(pod).then((episodes) => {
               commit('setEpisodes', episodes);
               commit('setLoadingEpisodes', false);
            })
            .catch((err) => {
               console.warn("Error loading episodes: ", err);
               commit('setLoadingEpisodes', false);
            });
         })
         .catch((err) => {
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
      podpupdao.unhideAllEpisodes(payload.podcast).then((data) => {
         if (state.current_pod.id === payload.podcast.id) {
            podpupdao.getAllEpisodes(state.current_pod).then((episodes) => {
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
      podpupdao.hideEpisode(payload.episode).then(() => {
         commit('hideEpisode', payload.episode);
      })
      .catch((err) => {
         console.error("Hiding Error: ", err);
         payload.errorCallback("Unable to hide episode");
      });
   },
   removePodcast({commit, state}, podcast) {
      podpupdao.removePodcast(podcast)
         .then(
            () => podpupdao.getAllPods(),
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
               podpupdao.updateEpisodeBookmark(ep, payload.bookmark);
               return;
            }
         });
      }
   },
   updateEpisodeFile(state, payload) {
      podpupdao.updateEpisodeFile(payload.episode, payload.filename);
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
   setLoadingEpisodes(state, value) {
      state.loading_episodes = value;
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