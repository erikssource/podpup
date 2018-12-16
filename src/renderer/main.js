import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueSanitize from 'vue-sanitize'

import poddao from './store/db/poddao'
import store from './store'

import App from './App'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

poddao.initialize()

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(VueSanitize)

/* eslint-disable no-new */
new Vue({
  components: { App },
  store,
  template: '<App/>',
  beforeMount() {
    this.$store.dispatch('initialize')
  }
}).$mount('#app')


