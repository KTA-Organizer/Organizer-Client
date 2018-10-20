import Vue from 'vue';
import Vuex from 'vuex';

import userModule from './user';

Vue.use(Vuex);

export const LoginStatus = {
  none: 0,
  loggedIn: 1,
  loggedOut: 2
};

export default new Vuex.Store({
  modules: {
    user: userModule
  }
});
