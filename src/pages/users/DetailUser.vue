<template>
<v-layout row justify-center wrap>
  <v-flex xs12 md6>
    <v-card>
      <v-card-title>
        <v-layout align-center justify-space-between row>
          <h1>{{user.firstname}} {{user.lastname}}</h1>
          <div>
            <v-btn v-if="user.status === 'ACTIVE'" color="error" class="ma-1" dark @click="deleteDialog = true">
              <v-icon dark>delete</v-icon>
              Deactiveer
            </v-btn>
            <v-btn v-else class="ma-1 light-green accent-4" dark @click="activateDialog = true">Activeer</v-btn>
            <v-btn color="primary" class="ma-1" dark @click="editUserMode = !editUserMode">
              <v-icon dark>edit</v-icon>
              {{!editUserMode ? "Aanpassen" : "stop aanpassen"}}
            </v-btn>
          </div>
        </v-layout>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-layout align-center justify-space-between row fill-height>
            <v-text-field label="Voornaam" v-model="userFields.firstname" :rules="firstnameRules" required :disabled="!editUserMode"></v-text-field>
            <v-text-field label="Naam" v-model="userFields.lastname" :rules="nameRules" required :disabled="!editUserMode"></v-text-field>
          </v-layout>
          <v-layout align-center justify-space-between row fill-height>
            <v-text-field label="E-mail" v-model="userFields.email" :rules="emailRules" required :disabled="!editUserMode"></v-text-field>
          </v-layout>
          <v-layout align-center justify-space-between row fill-height>
            <v-select label="Geslacht" v-model="userFields.gender" :rules="selectGenderRules" required :disabled="!editUserMode" :items="constants.genders"></v-select>
            <v-select label="Rollen" v-model="userFields.roles" counter="2" :rules="selectRoleRules" :multiple="true" required :disabled="!editUserMode" :items="constants.roles"></v-select>
          </v-layout>
          <v-btn @click="updateUser" color="primary" v-if="editUserMode">
            <v-icon>save</v-icon>
            Opslaan
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-flex>
  <v-flex xs12 md6 v-if="user.roles && user.roles.indexOf('STUDENT') > -1">
    <v-card>
      <v-card-title>
        <v-layout align-center justify-space-between row>
          <h2>Opleiding</h2>
            <v-btn color="primary" class="ma-1" dark @click="editOpleidingMode = !editOpleidingMode">
              <v-icon dark>edit</v-icon>
              {{!editOpleidingMode ? "Aanpassen" : "stop aanpassen"}}
            </v-btn>
        </v-layout>
      </v-card-title>
      <v-card-text>
        <v-layout align-center justify-space-between row fill-height>
          <v-select label="Opleiding" :disabled="!editOpleidingMode" v-model="opleiding" :rules="selectOpleidingRules" :items="opleidingnames"></v-select>
        </v-layout>
        <v-btn @click="updateOpleiding" v-if="editOpleidingMode" color="primary">Opleiding aanpassen</v-btn>
      </v-card-text>
    </v-card>
  </v-flex>
  <confirmdialog v-bind:model.sync="deleteDialog" :name="user.firstname + ' ' + user.lastname" :action="'verwijderen'" v-on:confirm="deleteUser(user.id)"></confirmdialog>
  <succesdialog v-bind:model="confirmDeleteDialog" :name="user.firstname + ' ' + user.lastname" :action="'verwijderd'" :link="'/Gebruikers'"></succesdialog>
  <confirmdialog v-bind:model.sync="activateDialog" :name="user.firstname + ' ' + user.lastname" :action="'activeren'" v-on:confirm="activateUser(user.id)"></confirmdialog>
</v-layout>
</template>

<script>
import store from "../../store/index";
import { mapGetters } from "vuex";
import * as rules from "../../constants/rules";
import * as constants from "../../constants/user";

export default {
  name: "DetailUser",
  data() {
    return {
      user: {},
      userFields: {},
      firstnameRules: rules.firstname,
      nameRules: rules.name,
      emailRules: rules.email,
      selectRoleRules: rules.role,
      selectOpleidingRules: rules.opleiding,
      selectGenderRules: rules.gender,
      editUserMode: false,
      editOpleidingMode: false,
      opleidingen: [],
      opleidingnames: [],
      opleiding: undefined,
      deleteDialog: false,
      confirmDeleteDialog: false,
      confirmActivateDialog: false,
      activateDialog: false,
      constants: constants
    };
  },
  methods: {
    async deleteUser(id) {
      console.log(`Gebruiker met id: ${id} wordt verwijderd`);
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
      await this.$http.updateUser({ ...this.user, gender, roles });
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

      this.opleidingen = await this.$http.getOpleidingen();
      const userOpleiding = await this.$http.getOpleidingForStudent(userId);
      if (userOpleiding) {
        this.opleiding = userOpleiding.name;
      }
      this.opleidingnames = this.opleidingen.map(opl => opl.name);
      console.log(this.user)
    },
    async activateUser(id) {
      await this.$http.activateUser(id);
      await this.fetchUser();
      this.activateDialog = false;
    },
    async updateOpleiding() {
      const selectedOpleiding = this.opleidingen.find(
        x => x.name === this.opleiding
      );
      if (!selectedOpleiding) {
        throw new Error("Deze opleiding bestaat niet.");
      }
      await this.$http.assignOpleidingToUser(
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
