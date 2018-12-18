<template>
<div>
    <v-layout row wrap>
        <v-flex xs11 sm8 md10 class="text-xs-left">
            <h1 class="display-3">Overzicht van gebruikers</h1>
        </v-flex>
        <v-flex :align-end="true">
            <router-link to="Gebruikers/Toevoegen" style="text-decoration: none">
                <v-btn fab dark color="red">
                    <v-icon>person_add</v-icon>&nbsp;
                </v-btn>
            </router-link>
        </v-flex>
    </v-layout>
    <v-card>
        <v-card-text>
            <v-layout row wrap>
                <v-flex xs12 sm6 md3>
                    <v-layout mr-2>
                        <v-text-field clearable autofocus="autofocus" type="text" placeholder="Filter op naam" v-model="nameFilter" v-on:input="doDelayedSearch()"></v-text-field>
                    </v-layout>
                </v-flex>
                <v-flex xs12 sm6 md3>
                    <v-layout mr-2>
                        <v-select clearable no-data-text="Geen data beschikbaar" v-model="disciplineFilter" label="Filter op opleiding" :items="disciplineNames" v-on:input="paginateUsers()"></v-select>
                    </v-layout>
                </v-flex>
                <v-flex xs12 sm6 md3>
                    <v-layout mr-2>
                        <v-select clearable no-data-text="Geen data beschikbaar" :items="roles" v-model="roleFilter" label="Filter op rol" v-on:input="paginateUsers()"></v-select>
                    </v-layout>
                </v-flex>
                <v-flex xs12 sm6 md3>
                    <v-layout mr-2>
                        <v-select no-data-text="Geen data beschikbaar" v-model="statusFilter" label="Filter op status" :items="statusses" v-on:input="paginateUsers()"></v-select>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-card-text>
    </v-card>
    <v-layout row wrap>
        <v-flex class="mt-4">
            <v-data-table no-data-text="Geen gebruikers gevonden" disable-initial-sort v-bind:headers="headers" :items="filteredGebruikers" :rows-per-page-items="[25, 50, 100]" :pagination.sync="pagination" :total-items="totalUsers" :loading="loading" class="elevation-1">
                <template slot="items" slot-scope="gebruiker">
                    <tr>
                        <td class="text-xs-left">{{ gebruiker.item.firstname }} {{gebruiker.item.lastname}}</td>
                        <td class="text-xs-left">{{ gebruiker.item.disciplinename }}</td>
                        <td class="text-xs-left">{{ getKeyByValue(constants.roleKeys, gebruiker.item.role) }}</td>
                        <td class="text-xs-left">{{ gebruiker.item.email }}</td>
                        <td class="text-xs-left">{{ getKeyByValue(constants.statusKeys, gebruiker.item.status) }}</td>
                        <td class="text-xs-left">{{ readableDate(gebruiker.item.accountCreatedTimestamp) }}</td>
                        <td>
                            <v-layout row>
                                <v-btn v-if="gebruiker.item.status === constants.statusKeys.Actief" @click="showDeleteDialog(gebruiker.item.id)" fab color="error" small><v-icon>close</v-icon></v-btn>
                                <router-link :to="`/Gebruikers/${gebruiker.item.id}`">
                                <v-btn color="primary"><i class="material-icons">remove_red_eye</i></v-btn>
                            </router-link>
                            </v-layout>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-flex>

    </v-layout>
    <confirmdialog v-bind:model.sync="showDeleteDialogBool" v-on:confirm="removeUser" :name="'deze gebruiker'" :action="'verwijderen'">
    </confirmdialog>
</div>
</template>

<script>
import * as constants from "../../constants/user";
import moment from "moment";

function createStudentOpleidingMap(students, opleidingen) {
    return students.map(function (student) {
        const opleiding = opleidingen.find(x => x.id === student.opleidingId);
        student.opleidingsNaam =
            opleiding !== undefined ? opleiding.name : "Geen opleiding gevonden.";
        return student;
    });
}

function addLeadingZero(numberToFormat) {
    return (numberToFormat =
        numberToFormat < 10 ? "0" + numberToFormat : numberToFormat);
}

export default {
    name: "Gebruikers",
    data() {
        return {
            showDeleteDialogBool: false,
            constants: constants,
            receivedData: false,
            formData: [],
            gebruikers: [],
            filteredGebruikers: [],
            search: "",
            keys: ["firstname", "lastname"],
            zoeklabel: "gebruiker",
            filters: [],
            item_name: "fullname",
            item_value: "id",
            headers: [{
                    text: "Naam",
                    align: "left",
                    value: "naam",
                    sortable: false
                },
                {
                    text: "Opleiding",
                    align: "left",
                    value: "opleiding",
                    sortable: false
                },
                {
                    text: "Rol",
                    align: "left",
                    value: "role",
                    sortable: false
                },
                {
                    text: "Email",
                    align: "left",
                    value: "email",
                    sortable: false
                },
                {
                    text: "Status",
                    align: "left",
                    value: "status",
                    sortable: false
                },
                {
                    text: "Datum aangemaakt",
                    value: "accountCreatedTimestamp",
                    sortable: false
                }
            ],
            nameFilter: "",
            roleFilter: "",
            statusFilter: "Actief",
            disciplineFilter: undefined,
            roleKeys: constants.roleKeys,
            roles: constants.roles,
            genders: constants.genders,
            genderKeys: constants.genderKeys,
            statusses: constants.statusses,
            statusKeys: constants.statusKeys,
            pagination: {},
            totalUsers: 0,
            loading: true,
            disciplines: [],
            userToDelete: -1,
        };
    },
    watch: {
        pagination: {
            async handler() {
                await this.paginateUsers();
            },
            deep: true
        }
    },
    async mounted() {
        await this.paginateUsers();
    },
    methods: {
        getFilters() {
            const search = this.nameFilter;
            const status = this.statusKeys[this.statusFilter];
            const role = this.roleKeys[this.roleFilter] ?
                this.roleKeys[this.roleFilter].toUpperCase() :
                false;
            const foundDiscipline = this.disciplines.find(discipline => discipline.name === this.disciplineFilter);
            const disciplineid = foundDiscipline ? foundDiscipline.id : undefined;
            return {search, status, role, disciplineid};
        },
        readableDate(timeStamp) {
            return moment(timeStamp).format('L LT');
        },
        getKeyByValue(object, value) {
            return Object.keys(object).find(key => object[key] === value);
        },
        async paginateUsers() {
            this.loading = true;
            const {
                sortBy,
                descending,
                page,
                rowsPerPage
            } = this.pagination;
            const filters = this.getFilters();
            const result = await this.$http.paginateUsers(
                page,
                rowsPerPage,
                filters
            );
            this.gebruikers = result.items;
            this.filteredGebruikers = this.gebruikers;
            this.totalUsers = result.total;
            this.loading = false;
        },
        doDelayedSearch() {
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            this.timeout = setTimeout(x => {
                this.paginateUsers();
            }, 500);
        },
        showDeleteDialog(userid) {
            this.userToDelete = userid;
            this.showDeleteDialogBool = true;
        },
        async removeUser() {
            await this.$http.deleteUser(this.userToDelete);
            this.userToDelete = -1;
            this.paginateUsers();
            this.showDeleteDialogBool = false;
        }
    },
    async created() {
        this.disciplines = await this.$http.getDisciplines();
    },
    computed: {
        disciplineNames() {
            return this.disciplines.map(x => x.name);
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
div.menu__content--autocomplete {
    top: 165px !important;
}
</style>
