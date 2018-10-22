import router from '../router/index'
import * as api from '../services/organizer-api'

export const LoginStatus = {
  none: 0,
  loggedIn: 1,
  loggedOut: 2
}

export default {
  state: {
    currentUser: {},
    loginStatus: LoginStatus.none
  },
  getters: {
    checkedAuthentication(state, getters) {
      return state.loginStatus !== LoginStatus.none;
    },
    isLoggedIn(state, getters) {
      return state.loginStatus === LoginStatus.loggedIn;
    },
    currentUser(state) {
      return state.currentUser;
    }
  },
  mutations: {
    USER_LOGGED_IN(state, user) {
      state.currentUser = user;
      state.loginStatus = LoginStatus.loggedIn;
    },
    USER_LOGGED_OUT(state) {
      state.currentUser = {};
      state.loginStatus = LoginStatus.loggedOut;
    }
  },
  actions: {
    async checkAuthentication({ commit, state }) {
      try {
        const user = await api.getCurrentUser();
        commit("USER_LOGGED_IN", user);
      } catch (err) {
        commit("USER_LOGGED_OUT");
      }
    },
    async login({ commit, state }, { email, password }) {
      try {
        const user = await api.login(email, password);
        commit("USER_LOGGED_IN", user);
        router.push("/home");
      } catch(err) {
        console.log(err)
        commit("USER_LOGGED_OUT");
      }
    },
    async logout({ commit, state }) {
      await api.logout();
      commit("USER_LOGGED_OUT");
      router.push("/login");
    }
  }
};