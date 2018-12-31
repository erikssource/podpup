import AppProperties from '../../../common/appproperties';
import podpupdao from '../db/podpupdao';

const state = {
   poddir: null,
   concurrentDownloads: 3,
   concurrentRefreshes: 3
};

const actions = {
   loadConfig({commit}) {
      let poddir = AppProperties.getProperties().getProperty(AppProperties.datadir);
      commit('setPodDir', poddir);
      podpupdao.initialize(poddir);
   },
   shutdown({commit}) {
      podpupdao.shutdown();
   },
   setPodpupDir({commit}, newPodpupDir) {
      AppProperties.getProperties().setProperty(AppProperties.datadir, newPodpupDir);
      commit('setPodDir', newPodpupDir);
   }
};

const mutations = {
   setPodDir(state, poddir) {
      state.poddir = poddir;
   }
};

export default {
   state,
   actions,
   mutations
};
