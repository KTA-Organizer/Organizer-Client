<template>
<v-card>
    <v-card-title>
        <v-layout align-center justify-space-between row>
            <h1>{{user.firstname}} {{user.lastname}}</h1>
            <div v-if="isAdmin">
                <v-btn v-if="user.status === 'ACTIVE'" color="error" class="ma-1" dark @click="$emit('update:delete', true)">
                    <v-icon dark>delete</v-icon>&nbsp;
                    Deactiveer
                </v-btn>
                <v-btn v-if="user.status === 'DISABLED'" class="ma-1 light-green accent-4" dark @click="$emit('update:activate', true)">Activeer</v-btn>
                <v-btn :disabled="user.status === 'WAIT_ACTIVATION'" color="primary" class="ma-1" dark @click="$emit('update:edit', !edit)">
                    <v-icon dark>edit</v-icon>&nbsp;
                    {{!edit ? "Aanpassen" : "stop aanpassen"}}
                </v-btn>
            </div>
        </v-layout>
    </v-card-title>
    <v-card-text>
        <v-form ref="form" lazy-validation>
            <p v-if="user.status === 'WAIT_ACTIVATION'">Waiting for user to accept invitation email.</p>
            <v-layout align-center justify-space-between row fill-height>
                <v-text-field label="Voornaam" v-model="userFields.firstname" :rules="firstnameRules" required :readonly="!edit"></v-text-field>
                <v-text-field label="Naam" v-model="userFields.lastname" :rules="nameRules" required :readonly="!edit"></v-text-field>
            </v-layout>
            <v-layout align-center justify-space-between row fill-height>
                <v-text-field label="E-mail" v-model="userFields.email" :readonly="!edit"></v-text-field>
            </v-layout>
            <v-layout align-center justify-space-between row fill-height>
                <v-text-field label="Rijksregisternummer" v-model="userFields.nationalRegisterNumber" mask="##.##.##-###.##" :readonly="!edit">
                </v-text-field>
            </v-layout>
            <v-layout align-center justify-space-between row fill-height>
                <v-select no-data-text="Geen data beschikbaar" label="Geslacht" v-model="userFields.gender" :rules="selectGenderRules" required :readonly="!edit" :items="constants.genders"></v-select>
                <v-select no-data-text="Geen data beschikbaar" label="Rollen" v-model="userFields.roles" :rules="selectRoleRules" :multiple="true" required :readonly="!edit" :items="constants.roles"></v-select>
            </v-layout>
            <v-btn @click="$emit('update')" color="primary" v-if="edit">
                <v-icon>save</v-icon>&nbsp;
                Opslaan
            </v-btn>
        </v-form>
    </v-card-text>
</v-card>
</template>

<script>
import * as constants from "../../constants/user";
import * as rules from "../../constants/rules";
import { mapGetters } from 'vuex';

export default {
    name: "UserDetailCard",
    props: ["user", "delete", "edit", "activate", "userFields"],
    computed: mapGetters(["isAdmin"]),
    data() {
        return {
            firstnameRules: rules.firstname,
            nameRules: rules.name,
            emailRules: rules.email,
            selectRoleRules: rules.role,
            selectOpleidingRules: rules.opleiding,
            selectGenderRules: rules.gender,
            rgnRules: rules.rgn,
            constants: constants
        };
    }
};
</script>
