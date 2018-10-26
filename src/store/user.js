import router from "../router/index";
import * as api from "../services/organizer-api";

export const LoginStatus = {
  none: 0,
  loggedIn: 1,
  loggedOut: 2
};

export const USER_CONSTANTS = {
  roles: [
    "Administrator",
    "Student",
    "Leerkracht"
  ],
  roleKeys: {
    Administrator: "ADMIN",
    Student: "STUDENT",
    Leerkracht: "TEACHER"
  },
  genders: ["Man", "Vrouw"],
  genderKeys: {
    Man: "M",
    Vrouw: "F"
  },
  statusses: ["Actief", "Wacht op activatie", "Niet actief"],
  statusKeys: {
    Actief: "ACTIVE",
    "Wacht op activatie": "WAIT_ACTIVATION",
    "Niet actief": "DISABLED"
  }
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
    isLoggedIn(state, getters) {
      return state.loginStatus === LoginStatus.loggedIn;
    },
    currentUser(state) {
      return state.currentUser;
    },
    constants() {
      return USER_CONSTANTS;
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
      } catch (err) {
        console.log(err);
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
