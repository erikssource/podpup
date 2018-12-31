import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import VueSanitize from 'vue-sanitize';
import Toasted from 'vue-toasted';

import poddao from './store/db/poddao';
import store from './store';

import App from './App';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { toLinuxArchString } from 'builder-util';

poddao.initialize();

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(VueSanitize);
Vue.use(Toasted, {
  iconPack : 'fontawesome'
});

Vue.toasted.register('pp_error',
  (payload) => {
    return payload.message;
  },
  {
    icon: 'skull-crossbones',
    duration: 8000,
    action: [
      {
        text: 'Dismiss',
        onClick: (e, toastObject) => {
          toastObject.goAway(0);
        }
      }
    ]
  }
);

/* eslint-disable no-new */
new Vue({
  components: { App },
  store,
  template: '<App/>',
  created() {
    this.$store.dispatch('loadConfig');
  },
  beforeMount() {
    this.$store.dispatch('initialize');
    this.$electron.ipcRenderer.on('before-quit', (event) => {
      this.$store.dispatch('shutdown');
   });
  }
}).$mount('#app');


