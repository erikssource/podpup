import casts from '../api/casts'
import poddao from '../db/poddao'
import downloader from '../../common/downloader'

const state = {
   podcasts: [],
   episodes: null,
   current_episodes: null,
   current_pod: null,
   play_episode: null
}

const getters = {
}

const actions = {
   initialize ({commit}) {
      console.log("INITIALIZING THE STORE")
      poddao.getAllPods().then((pods) => {
         commit('loadPodcasts', pods)
      })
   },
   updatePodcast({commit, state}, podcast) {
      casts.updateFeed(podcast)
         .then((pod) => {
            if (state.current_pod && state.current_pod.id == pod.id) {
               poddao.getAllEpisodes(podcast).then((episodes) => commit('setEpisodes', episodes))
            }
         })
   },
   podAdded ({commit}, url) {
      casts.loadFeed(url, (feed) => {
         console.log("NEW POD: ", feed)
         commit('addPodcast', feed)
      })
   },
   podSelected ({commit}, podcast) {
      // TODO: Handling selecting nothing
      poddao.getPodcast(podcast)
         .then((pod) => {
            commit('setCurrentPod', pod)
            commit('setEpisodes', pod.Episodes)
         })
   },
   playEpisode ({commit}, episode) {
      commit('setPlayingEpisode', episode)
   },
   updateBookmark({commit}, payload) {
      commit('updateEpisodeBookmark', {episode: payload.episode, bookmark: payload.position})
   },
   downloadEpisode({commit, state}, payload) {
      downloader.downloadEpisode(state.current_pod, payload.episode, payload.progress, (fileName) => {
         payload.progress(100)
         commit('updateEpisodeFile', { episode: payload.episode, filename: fileName} )
         payload.complete()
      })
   },
   deleteDownload({commit}, episode) {
      downloader.deleteDownload(episode.filename);
      commit('updateEpisodeFile', { episode: episode, filename: null} )
   }
}

const mutations = {
   addPodcast(state, feed) {
      state.podcasts.push({id: feed.id, title: feed.title, lastupdate: feed.lastupdate})
   },
   loadPodcasts(state, pods) {
      state.podcasts = pods;
   },
   setCurrentPod(state, podcast) {
      state.current_pod = podcast;
   },
   setEpisodes(state, episodes) {
      state.current_episodes = episodes
   },
   //TODO: Consolidate episode updates
   //TODO: Use array like a hash instead of this
   updateEpisodeBookmark(state, payload) {
      if (state.current_episodes) {
         state.current_episodes.forEach((ep) => {
            if (payload.episode.id === ep.id) {               
               ep.bookmark = payload.bookmark
               poddao.updateEpisode(ep.id, {bookmark: payload.bookmark})
               return
            }
         })
      }
   },
   updateEpisodeFile(state, payload) {
      if (state.current_episodes) {
         state.current_episodes.forEach((ep) => {
            if (payload.episode.id === ep.id) {               
               ep.filename = payload.filename
               poddao.updateEpisode(ep.id, {filename: payload.filename})
               return
            }
         })
      }
   },
   setPlayingEpisode(state, episode) {
      state.play_episode = episode
   },


}

export default {
   state,
   getters,
   actions,
   mutations
}