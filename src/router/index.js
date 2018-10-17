import Vue from "vue";
import Router from "vue-router";
import Index from "@/components/Index";
import Reports from "@/components/Reports";
import Home from "@/components/Home";
import Students from "@/components/Students";
import AddStudent from "@/components/AddStudent";
import Print from "@/components/Print";
import checkboxes from "@/components/CheckboxContainer";
import Subjects from "@/components/Subjects";
import fileInput from "@/components/file-input";
import SearchBar from "@/components/SearchBar";
import Evaluate from "@/components/Evaluate";
import Login from "@/components/Login";
import SubjectEditor from "@/components/SubjectEditor";
import DataTableSelects from "@/components/DataTableSelects";
import Datepicker from "vuejs-datepicker";

Vue.component("fileInput", fileInput);
Vue.component("checkboxes", checkboxes);
Vue.component("searchbar", SearchBar);
Vue.component("subjecteditor", SubjectEditor);
Vue.component("datatableselects", DataTableSelects);
Vue.component("datepicker", Datepicker);
Vue.use(Router);
import * as api from "../js/API_module";

export default new Router({
  routes: [
    {
      path: "/",
      name: "index",
      component: Index,
      beforeEnter: async (to, from, next) => {
        try {
          const user = await api.getCurrentUser();
          if (user == null) {
            next({ path: "/login" });
          } else {
            next();
          }
        } catch (error) {
          console.log("Not logged in");
          next({ path: "/login" });
        }
        const user = await api.getCurrentUser();
        if (user == null) {
          next({ path: "/login" });
        } else {
          next();
        }
      },
      children: [
        {
          path: "/rapporten",
          name: "rapporten",
          component: Reports
        },
        {
          path: "/studenten",
          name: "studenten",
          component: Students
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
          path: "/addstudent",
          name: "addstudent",
          component: AddStudent
        },
        {
          path: "/evaluate",
          name: "evaluate",
          component: Evaluate
        },
        {
          path: "/home",
          name: "home",
          component: Home
        }
      ]
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      beforeEnter: (to, from, next) => {
        const user = $cookies.get("user-session");
        if (user != null) {
          next({ path: "/home" });
        } else {
          next();
        }
      }
    }
  ]
});
