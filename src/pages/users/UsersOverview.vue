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
                <v-flex xs12 sm6 md2>
                    <v-layout mr-2>
                        <v-text-field clearable autofocus="autofocus" type="text" placeholder="Filter op naam" v-model="nameFilter" v-on:input="doDelayedSearch()"></v-text-field>
                    </v-layout>
                </v-flex>
                <v-flex xs12 sm6 md3>
                    <v-layout mr-2>
                        <v-select clearable no-data-text="Geen data beschikbaar" v-model="statusFilter" label="Filter op opleiding" :items="statusses" v-on:input="paginateUsers()"></v-select>
                    </v-layout>
                </v-flex>
                <v-flex xs12 sm6 md2>
                    <v-layout mr-2>
                        <v-select clearable no-data-text="Geen data beschikbaar" :items="roles" v-model="roleFilter" label="Filter op rol" v-on:input="paginateUsers()"></v-select>
                    </v-layout>
                </v-flex>
                <v-flex xs12 sm6 md2>
                    <v-layout mr-2>
                        <v-select clearable no-data-text="Geen data beschikbaar" :items="genders" v-model="genderFilter" label="Filter op geslacht" v-on:input="paginateUsers()"></v-select>
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
            <v-data-table no-data-text="Geen gebruikers gevonden" disable-initial-sort v-bind:headers="headers" :items="filteredGebruikers" :pagination.sync="pagination" :total-items="totalUsers" :loading="loading" class="elevation-1">
                <template slot="items" slot-scope="gebruiker">
                    <tr>
                        <td class="text-xs-left">{{ gebruiker.item.firstname }} {{gebruiker.item.lastname}}</td>
                        <td class="text-xs-left">{{ getKeyByValue(constants.roleKeys, gebruiker.item.role) }}</td>
                        <td class="text-xs-left">{{ gebruiker.item.email }}</td>
                        <td class="text-xs-left">{{ gebruiker.item.gender }}</td>
                        <td class="text-xs-left">{{ getKeyByValue(constants.statusKeys, gebruiker.item.status) }}</td>
                        <td class="text-xs-left">{{ readableDate(gebruiker.item.accountCreatedTimestamp) }}</td>
                        <td>
                            <router-link :to="`/Gebruikers/${gebruiker.item.id}`">
                                <v-btn color="primary"><i class="material-icons">remove_red_eye</i></v-btn>
                            </router-link>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-flex>

    </v-layout>
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
                    sortable: true
                },
                {
                    text: "Rol",
                    align: "left",
                    value: "role",
                    sortable: true
                },
                {
                    text: "Email",
                    align: "left",
                    value: "email",
                    sortable: true
                },
                {
                    text: "Geslacht",
                    align: "left",
                    value: "gender",
                    sortable: true
                },
                {
                    text: "Status",
                    align: "left",
                    value: "status",
                    sortable: true
                },
                {
                    text: "Datum aangemaakt",
                    value: "accountCreatedTimestamp"
                }
            ],
            nameFilter: "",
            roleFilter: "",
            genderFilter: "",
            statusFilter: "Actief",
            roleKeys: constants.roleKeys,
            roles: constants.roles,
            genders: constants.genders,
            genderKeys: constants.genderKeys,
            statusses: constants.statusses,
            statusKeys: constants.statusKeys,
            pagination: {},
            totalUsers: 0,
            loading: true,
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
            const gender = this.genderKeys[this.genderFilter];
            return {search, status, role, gender};
        },
        readableDate(timeStamp) {
            return moment(timeStamp).format('L LT');
        },
        getKeyByValue(object, value) {
            return Object.keys(object).find(key => object[key] === value);
        },
        clearNameFilter() {
            this.nameFilter = "";
            this.paginateUsers();
        },
        clearGenderFilter() {
            this.genderFilter = "";
            this.paginateUsers();
        },
        clearRoleFilter() {
            this.roleFilter = "";
            this.paginateUsers();
        },
        clearStatusFilter() {
            this.statusFilter = "";
            this.paginateUsers();
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
            console.log(result);
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
        }
    },
    async created() {
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
div.menu__content--autocomplete {
    top: 165px !important;
}
</style>
