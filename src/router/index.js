import Vue from "vue";
import Router from "vue-router";

/* import pages */
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/users/Users";
import AddUser from "@/pages/users/AddUser";
import UsersOverview from "@/pages/users/UsersOverview";
import DetailUser from "@/pages/users/DetailUser";
import ChoosePassword from "@/pages/auth/ChoosePassword";
import Print from "@/pages/utils/Print";
import NotFound from "@/pages/utils/NotFound";
import AddMelding from "@/pages/notifications/AddMelding";
import Login from "@/pages/auth/Login";
import Subjects from "@/pages/disciplines/Subjects";
import SubjectEditor from "@/pages/disciplines/SubjectEditor";
import Reports from "@/pages/grading/Reports";
import Evaluate from "@/pages/grading/Evaluate";
/* import pages */

/* import components */
import UserDetail from "@/components/users/UserDataTable";
import Notifications from "@/components/notifications/NotificationList";
import LoginForm from "@/components/auth/LoginForm";
import ForgotPwForm from "@/components/auth/ForgotPassword"
import SetPw from "@/components/auth/SetPassword";
import SearchBar from "@/components/utils/SearchBar";
import checkboxes from "@/components/utils/CheckboxContainer";
import DataTableSelects from "@/components/utils/DataTableSelects";
import DisciplineDataTable from "@/components/disciplines/DisciplineDataTable";
import Datepicker from "vuejs-datepicker";
/* import components */

/* set components */
Vue.component("checkboxes", checkboxes);
Vue.component("searchbar", SearchBar);
Vue.component("subjecteditor", SubjectEditor);
Vue.component("datatableselects", DataTableSelects);
Vue.component("datepicker", Datepicker);
Vue.component("userdetail", UserDetail);
Vue.component("notification", Notifications)
Vue.component("loginform", LoginForm);
Vue.component("forgotpassword", ForgotPwForm);
Vue.component("setpassword", SetPw);
Vue.component("disciplineDataTable", DisciplineDataTable);
/* set components */

Vue.use(Router);

import store from "../store/index";

function requireAuth(to, from, next) {
  if (store.getters.isLoggedIn) {
    next();
  } else {
    setTimeout(() => {
      if (store.getters.isLoggedIn) {
        next();
      } else {
        next("/login");
      }
    }, 200);
  }
}

function requireUnauth(to, from, next) {
  if (store.getters.isLoggedIn) {
    next("/");
  } else {
    setTimeout(() => {
      if (store.getters.isLoggedIn) {
        next("/dashboard");
      } else {
        next();
      }
    }, 200);
  }
}

export default new Router({
  routes: [
    {
      path: "/",
      name: "index",
      component: Index,
      beforeEnter: requireAuth,
      redirect: "/dashboard",
      children: [
        {
          path: "/dashboard",
          name: "dashboard",
          component: Dashboard
        },
        {
          path: "/rapporten",
          name: "rapporten",
          component: Reports
        },
        {
          path: "/afdrukken",
          name: "afdrukken",
          component: Print
        },
        {
          path: "/opleidingen",
          name: "opleidingen",
          component: Subjects
        },
        {
          path: "/evaluate",
          name: "evaluate",
          component: Evaluate
        },
        {
          path: "/Gebruikers",
          component: Users,
          children: [
            {
              path: "",
              name: "Gebruikers",
              component: UsersOverview
            },
            {
              path: "Toevoegen",
              name: "addUser",
              component: AddUser
            },
            {
              path: ":id",
              name: "detailUser",
              component: DetailUser
            }
          ]
        },
        {
          path: "/addMelding",
          name: "addMelding",
          component: AddMelding
        }
      ]
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      beforeEnter: requireUnauth
    },
    {
      path: "/reset",
      name: "reset",
      component: ChoosePassword,
      beforeEnter: requireUnauth
    },
    {
      path: "/invitation",
      name: "invitation",
      component: ChoosePassword,
      beforeEnter: requireUnauth
    },
    { path: '/404', component: NotFound },
    { path: '*', redirect: '/404' },
  ]
});
