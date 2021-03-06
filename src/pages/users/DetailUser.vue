<template>
<v-layout row justify-center wrap>
    <v-flex xs12 md6 class="mb-4">
        <userdetailcard v-on:update="updateUser" v-bind:user.sync="user" v-bind:delete.sync="deleteDialog" v-bind:edit.sync="editUserMode" v-bind:activate.sync="activateDialog" v-bind:userFields.sync="userFields"></userdetailcard>
    </v-flex>
    <v-flex xs12 md6 v-if="isStudent" class="mb-4">
        <choosediscipline v-on:confirm="updateDiscipline" v-bind:model.sync="editOpleidingMode" v-bind:discipline.sync="opleiding" :items="opleidingnames"></choosediscipline>
    </v-flex>
    <v-flex xs12 md6 v-if="isStudent">
        <h3>Evaluaties</h3>
        <list-user-evaluation v-if="user.id" class="mt-4" :userid="user.id"></list-user-evaluation>
    </v-flex>
    <v-flex xs12 md6 v-if="isStudent">
        <h3>Rapporten</h3>
        <list-user-report v-if="user.id" class="mt-4" :userid="user.id"></list-user-report>
    </v-flex>
    <confirmdialog v-bind:model.sync="deleteDialog" :name="user.firstname + ' ' + user.lastname" :action="'verwijderen'" v-on:confirm="deleteUser(user.id)"></confirmdialog>
    <succesdialog v-bind:model="confirmDeleteDialog" :name="user.firstname + ' ' + user.lastname" :action="'verwijderd'" :link="'/Gebruikers'"></succesdialog>
    <confirmdialog v-bind:model.sync="activateDialog" :name="user.firstname + ' ' + user.lastname" :action="'activeren'" v-on:confirm="activateUser(user.id)"></confirmdialog>
</v-layout>
</template>

<script>
import store from "../../store/index";
import {
    mapGetters
} from "vuex";
import * as constants from "../../constants/user";

export default {
    name: "DetailUser",
    data() {
        return {
            user: {},
            userFields: {},
            editUserMode: false,
            editOpleidingMode: false,
            opleidingen: [],
            opleidingnames: [],
            opleiding: undefined,
            deleteDialog: false,
            confirmDeleteDialog: false,
            confirmActivateDialog: false,
            activateDialog: false,
        };
    },
    computed: {
        isStudent() {
            return this.user.roles && this.user.roles.indexOf('STUDENT') > -1;
        }
    },
    methods: {
        async deleteUser(id) {
            await this.$http.deleteUser(id);
            this.deleteDialog = false;
            this.confirmDeleteDialog = true;
        },
        getKeyByValue(object, value) {
            return Object.keys(object).find(key => object[key] === value);
        },
        async updateUser() {
            const gender = constants.genderKeys[this.userFields.gender];
            const roles = this.userFields.roles.map(r => constants.roleKeys[r]);
            if (!this.userFields.email || this.userFields.email === "") {
                delete this.userFields.email;
            }
            console.log(this.userFields);
            await this.$http.updateUser({ ...this.userFields,
                gender,
                roles
            });
            await this.fetchUser();
        },
        async fetchUser() {
            const userId = this.$route.params.id;
            this.user = await this.$http.getUser(userId);

            this.userFields = Object.assign({}, this.user);
            this.userFields.gender = this.getKeyByValue(
                constants.genderKeys,
                this.user.gender
            );
            this.userFields.roles = this.user.roles.map(r =>
                this.getKeyByValue(constants.roleKeys, r)
            );
            if (this.user.roles.indexOf('STUDENT') > -1) {
                this.opleidingen = await this.$http.getDisciplines();
                const userOpleiding = await this.$http.getDisciplineForStudent(userId);
                if (userOpleiding) {
                    this.opleiding = userOpleiding.name;
                }
                this.opleidingnames = this.opleidingen.map(opl => opl.name);
            }
        },
        async activateUser(id) {
            await this.$http.activateUser(id);
            await this.fetchUser();
            this.activateDialog = false;
        },
        async updateDiscipline() {
            const selectedOpleiding = this.opleidingen.find(
                x => x.name === this.opleiding
            );
            if (!selectedOpleiding) {
                throw new Error("Deze opleiding bestaat niet.");
            }
            this.editOpleidingMode = false;
            await this.$http.assignDisciplineToUser(
                selectedOpleiding.id,
                this.user.id
            );
            await this.fetchUser();
        }
    },
    async created() {
        await this.fetchUser();
    },
};
</script>
