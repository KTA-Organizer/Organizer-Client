<template>
<div>
    <v-layout row wrap>
        <v-flex xs11 sm8 md10 class="text-xs-left">
            <h1 class="display-3">Gebruiker toevoegen</h1>
        </v-flex>
    </v-layout>
    <v-layout row wrap>
        <v-flex xs10 offset-xs1>
            <v-form v-model="valid" ref="form" lazy-validation>
                <v-text-field label="Voornaam *" v-model="firstname" :rules="firstnameRules" required :autofocus="true"></v-text-field>
                <v-text-field label="Naam *" v-model="name" :rules="nameRules" required></v-text-field>
                <v-text-field label="E-mail" v-model="email"></v-text-field>
                <v-text-field label="Rijksregisternummer" v-model="rgn" mask="##.##.##-###.##">
                </v-text-field>
                <v-select no-data-text="Geen data beschikbaar" label="Geslacht *" v-model="gender" :rules="selectGenderRules" required :items="genders"></v-select>
                <v-select no-data-text="Geen data beschikbaar" label="Rol *" v-model="role" :rules="selectRoleRules" required :multiple="false" :items="roles"></v-select>
                <router-link to="/Gebruikers">
                    <v-btn color="secondary">Terug naar overzicht</v-btn>
                </router-link>
                <v-btn color="primary" :disabled="!valid" @click="createUser">Voltooien</v-btn>
            </v-form>
        </v-flex>
    </v-layout>
</div>
</template>

<script>
import store from "../../store/index";
import {
    mapGetters
} from "vuex";
import * as constants from "../../constants/user";
import * as rules from "../../constants/rules";

export default {
    name: "AddUser",
    data() {
        return {
            valid: false,
            firstname: "",
            name: "",
            email: "",
            rgn: "",
            gender: undefined,
            role: undefined,
            genders: constants.genders,
            genderKeys: constants.genderKeys,
            roles: constants.roles,
            roleKeys: constants.roleKeys,
            firstnameRules: rules.firstname,
            nameRules: rules.name,
            emailRules: rules.email,
            selectRoleRules: rules.role,
            selectGenderRules: rules.gender,
            rgnRules: rules.name
        };
    },
    methods: {
        async createUser() {
            if (this.$refs.form.validate()) {
                const roles = [this.roleKeys[this.role]];
                const newUser = {
                    firstname: this.firstname,
                    lastname: this.name,
                    email: this.email || undefined,
                    gender: this.genderKeys[this.gender],
                    roles: roles,
                    nationalRegisterNumber: this.rgn || undefined
                };
                const userIdObj = await this.$http.createUser(newUser);
                this.$router.push(`${userIdObj.id}`);
            }
        }
    }
};
</script>
