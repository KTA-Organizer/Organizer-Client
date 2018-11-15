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
import Disciplines from "@/pages/disciplines/Disciplines";
import DisciplinesList from "@/pages/disciplines/DisciplinesList";
import DisciplineOverview from "@/pages/disciplines/DisciplineOverview";
import Reports from "@/pages/grading/Reports";
import Evaluate from "@/pages/grading/Evaluate";
import ReportList from "@/pages/grading/ReportList";
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
import NewDomainDialog from "@/components/dialogs/NewDomainDialog";
import NewGoalDialog from "@/components/dialogs/NewGoalDialog";
import NewCriteriaDialog from "@/components/dialogs/NewCriteriaDialog";
import RemoveDomainDialog from "@/components/dialogs/RemoveDomainDialog";
import RemoveGoalDialog from "@/components/dialogs/RemoveGoalDialog";
import RemoveCriteriaDialog from "@/components/dialogs/RemoveCriteriaDialog";
import UserReport from "@/components/report/UserReport";
import ReportTable from "@/components/report/ReportTable";
import ListForUser from "@/components/evaluation/ListForUser";
/* import components */

/* set components */
Vue.component("checkboxes", checkboxes);
Vue.component("searchbar", SearchBar);
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
Vue.component("newdomaindialog", NewDomainDialog);
Vue.component("newgoaldialog", NewGoalDialog);
Vue.component("newcriteriadialog", NewCriteriaDialog);
Vue.component("removedomaindialog", RemoveDomainDialog);
Vue.component("removegoaldialog", RemoveGoalDialog);
Vue.component("removecriteriadialog", RemoveCriteriaDialog);
Vue.component("table-report", ReportTable);
Vue.component("list-user-evaluation", ListForUser);
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

const router = new Router({
    routes: [
        {
            path: "/",
            component: Index,
            beforeEnter: requireAuth,
            redirect: "/dashboard",
            children: [
                {
                    name: "Dashboard",
                    path: "/dashboard",
                    component: Dashboard
                },
                {
                    path: "/rapport",
                    component: Reports,
                    props: true,
                    children: [
                        {
                            name: "Rapporten",
                            path: "/",
                            component: ReportList,
                        },
                        {
                            name: "Rapport Aanmaken",
                            path: "/create",
                            component: CreateEvaluationOrReportForm,
                            props: {isReportGenerator: true}
                        },
                        {
                            name: "Rapport",
                            path: ":reportid",
                            component: UserReport,
                        }
                    ]
                },
                {
                    name: "Afdrukken",
                    path: "/afdrukken",
                    component: Print
                },
                {
                    path: "/opleidingen",
                    component: Disciplines,
                    children: [
                        {
                            name: "Opleidingen",
                            path: "/",
                            component: DisciplinesList,
                        },
                        {
                            name: "Opleiding",
                            path: ":disciplineid",
                            component: DisciplineOverview
                        },
                    ]
                },
                {
                    path: "/evaluatie",
                    component: Evaluate,
                    children: [
                        {
                            name: "Evaluatie",
                            path: "/",
                            component: CreateEvaluationOrReportForm
                        },
                        {
                            name: "Evaluatie voor Student",
                            path: ":studentId/:moduleId",
                            component: StudentEvaluation
                        }
                    ]
                },
                {
                    path: "/Gebruikers",
                    component: Users,
                    children: [
                        {
                            name: "Gebruikers",
                            path: "",
                            component: UsersOverview
                        },
                        {
                            name: "Gebruiker Toevoegen",
                            path: "Toevoegen",
                            component: AddUser
                        },
                        {
                            name: "Gebruiker Details",
                            path: ":id",
                            component: DetailUser
                        }
                    ]
                },
                {
                    name: "Melding toevoegen",
                    path: "/melding/toevoegen",
                    component: AddMelding
                },
                {
                    name: "Module",
                    path: "/modules/:moduleid",
                    component: Modules
                },
            ]
        },
        {
            name: "Inloggen",
            path: "/login",
            component: Login,
            beforeEnter: requireUnauth
        },
        {
            name: "Wachtwoord vergeten",
            path: "/reset",
            component: ChoosePassword,
            beforeEnter: requireUnauth
        },
        {
            name: "Uitnodiging",
            path: "/invitation",
            component: ChoosePassword,
            beforeEnter: requireUnauth,
        },
        { path: '/404', component: NotFound , name: "Deze pagina werd niet gevonden"},
        { path: '*', redirect: '/404' },
    ]
});

router.beforeEach((to, from, next) => {
    document.title = to.name
    next()
});

export default router;