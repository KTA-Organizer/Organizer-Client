import Vue from "vue";
import Router from "vue-router";

/* import pages */
import Modules from "@/pages/modules/Modules";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/users/Users";
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
import ConfirmDialog from "@/components/dialogs/confirmDialog";
import SuccesDialog from "@/components/dialogs/succesDialog";
import AddUser from "@/components/users/AddUser";
import ChooseDiscipline from "@/components/disciplines/ChooseDiscipline";
import UserDetailCard from "@/components/users/UserDetailCard";
import EditableModule from "@/components/modules/EditableModule";
import NewModuleDialog from "@/components/dialogs/NewModuleDialog";
import ModuleList from "@/components/modules/ModuleList";
import CreateEvaluationOrReportForm from "@/components/evaluation/CreateEvaluationOrReportForm";
import StudentEvaluation from "@/components/evaluation/StudentEvaluation";
import GradeBoxes from "@/components/evaluation/GradeBoxes";
import UserReport from "@/components/report/UserReport";
import ReportTable from "@/components/report/ReportTable";
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
Vue.component("confirmdialog", ConfirmDialog);
Vue.component("succesdialog", SuccesDialog);
Vue.component("choosediscipline", ChooseDiscipline);
Vue.component("userdetailcard", UserDetailCard);
Vue.component("editablemodule", EditableModule);
Vue.component("newmoduledialog", NewModuleDialog);
Vue.component("modulelist", ModuleList);
Vue.component("gradeboxes", GradeBoxes);
Vue.component("table-report", ReportTable);
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
                    path: "/rapport",
                    component: Reports,
                    props: true,
                    children: [
                        {
                            path: "/",
                            name: "rapport",
                            component: CreateEvaluationOrReportForm,
                            props: {isReportGenerator: true}
                        },
                        {
                            path: ":disciplinename/:studentId/:moduleId",
                            name: "ReportForUser",
                            component: UserReport,
                        },
                        {
                            path: ":moduleId",
                            name: "ReportsForModule",
                            component: CreateEvaluationOrReportForm,
                        }
                    ]
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
                    path: "/evaluatie",
                    component: Evaluate,
                    children: [
                        {
                            path: "/",
                            name: "Evaluatie",
                            component: CreateEvaluationOrReportForm
                        },
                        {
                            path: ":studentId/:moduleId",
                            name: "EvaluatieStudent",
                            component: StudentEvaluation
                        }
                    ]
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
                },
                {
                    path: "/modules",
                    name: "modules",
                    component: Modules
                },
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
            beforeEnter: requireUnauth,
        },
        { path: '/404', component: NotFound },
        { path: '*', redirect: '/404' },
    ]
});
