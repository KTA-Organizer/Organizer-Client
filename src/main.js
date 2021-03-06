import 'babel-polyfill';
import 'whatwg-fetch';

import Vue from 'vue';
import App from './App.vue';
import store from './store/index';
import VueCookies from 'vue-cookies';
import Vuetify from 'vuetify';
import router from "./router/index";
import * as api from "./services/organizer-api";
import moment from "moment";
import * as pdf from "./services/pdf";

moment.locale("nl");

import('./css/style.css');
import('../node_modules/vuetify/dist/vuetify.min.css');

// Dependency injection
Vue.prototype.$http = api;
Vue.prototype.$pdf = pdf;

Vue.config.productionTip = false;

Vue.use(Vuetify);
Vue.use(VueCookies);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
