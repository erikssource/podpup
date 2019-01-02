import Vue from 'vue';
import Vuex from 'vuex';
import podcasts from './modules/podcasts';
import controls from './modules/controls';
import config from './modules/config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    title: 'Podpup'
  },
  modules: {
    podcasts,
    controls,
    config
  },
  strict: false
});
