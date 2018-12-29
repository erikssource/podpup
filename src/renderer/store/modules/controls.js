
const episodes_display_mode = 'episodes';
const search_display_mode = 'search';
const settings_display_mode = 'settings';

const state = {
   pane_resize_active: true,
   display_mode: episodes_display_mode
};

const getters = {
   isShowingEpisodes(state) {
      return state.display_mode === episodes_display_mode;
   },
   isShowingSearch(state) {
      return state.display_mode === search_display_mode;
   },
   isShowingSettings(state) {
      return state.display_mode === settings_display_mode;
   },
};

const actions = {
   turnOffPaneResize({commit}) {
      commit('setPaneResize', false);
   },

   turnOnPaneResize({commit}) {
      commit('setPaneResize', true);
   },

   turnOnEpisodes({commit}) {
      commit('setDisplayMode', episodes_display_mode);
   },

   turnOnSearch({commit}) {
      commit('setDisplayMode', search_display_mode);
   },

   turnOnSettings({commit}) {
      commit('setDisplayMode', settings_display_mode);
   }
};

const mutations = {
   setPaneResize(state, value) {
      state.pane_resize_active = value;
   },
   setDisplayMode(state, value) {
      state.display_mode = value;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
