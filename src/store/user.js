import router from "../router/index";
import * as api from "../services/organizer-api";

export const LoginStatus = {
  none: 0,
  loggedIn: 1,
  loggedOut: 2,
  failed: 3
};

export default {
  state: {
    currentUser: {},
    loginStatus: LoginStatus.none
  },
  getters: {
    checkedAuthentication(state, getters) {
      return state.loginStatus !== LoginStatus.none;
    },
    hasFailedLogin(state, getters) {
      return state.loginStatus === LoginStatus.failed;
    },
    isLoggedIn(state, getters) {
      return state.loginStatus === LoginStatus.loggedIn;
    },
    isAdmin(state) {
      return state.currentUser.roles.indexOf("ADMIN") > -1;
    },
    isTeacher(state) {
      return state.currentUser.roles.indexOf("TEACHER") > -1;
    },
    isStudent(state) {
      return state.currentUser.roles.indexOf("STUDENT") > -1;
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
      state.loginStatus = LoginStatus.loggedOut;
      state.currentUser = {};
    },
    USER_LOGIN_FAIL(state) {
      state.loginStatus = LoginStatus.failed;
      state.currentUser = {};
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
        router.push("/dashboard");
      } catch (err) {
        console.log(err);
        commit("USER_LOGIN_FAIL");
      }
    },
    async logout({ commit, state }) {
      await api.logout();
      commit("USER_LOGGED_OUT");
      router.push("/login");
    }
  }
};
