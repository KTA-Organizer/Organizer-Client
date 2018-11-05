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
  <v-flex xs12 md6 v-if="user && user.roles.indexOf('STUDENT') > -1">
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
          <v-select label="Opleiding" :disabled="!editOpleidingMode" v-model="opleiding" :rules="selectRules" :items="opleidingnames"></v-select>
        </v-layout>
        <v-btn @click="updateOpleiding" v-if="editOpleidingMode" color="primary">Opleiding aanpassen</v-btn>
      </v-card-text>
    </v-card>
  </v-flex>
  <v-dialog width="500" v-model="deleteDialog">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Opgelet!
      </v-card-title>

      <v-card-text>
        <p>U staat op het punt om <strong>{{ user.firstname + ' ' + user.lastname  }}</strong> te verwijderen.</p>
        <p>Bent u dit zeker?</p>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat v-on:click="deleteDialog = false">
          Annuleer
        </v-btn>
        <v-btn color="error" flat v-on:click="deleteUser(user.id)">
          Bevestig
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog width="500" v-model="confirmDeleteDialog">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Verwijderd!
      </v-card-title>

      <v-card-text>
        <p><strong>{{ user.firstname + ' ' + user.lastname  }}</strong> is verwijderd.</p>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat v-on:click="$router.push('/Gebruikers')">
          Terug naar overzicht
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog width="500" v-model="activateDialog">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Opgelet!
      </v-card-title>

      <v-card-text>
        <p>U staat op het punt om <strong>{{ user.firstname + ' ' + user.lastname  }}</strong> te activeren.</p>
        <p>Bent u dit zeker?</p>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat v-on:click="activateDialog = false">
          Annuleer
        </v-btn>
        <v-btn color="error" flat v-on:click="activateUser(user.id)">
          Bevestig
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-layout>
</template>

<script>
import store from "../../store/index";
import { mapGetters } from "vuex";
export default {
  name: "DetailUser",
  data() {
    return {
      user: {},
      userFields: {},
      firstnameRules: [v => !!v || "Voornaam moet ingevuld worden"],
      nameRules: [v => !!v || "Naam moet ingevuld worden"],
      emailRules: [
        v => !!v || "E-mail moet ingevuld worden",
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail moet geldig zijn"
      ],
      selectRoleRules: [
        v =>
          (v.length > 0 && v.length < 3) ||
          "Rol moet ingevuld worden en kan maximum 2 rollen bevatten"
      ],
      selectRules: [ v => !!v || "Veld moet ingevuld worden!"],
      selectGenderRules: [v => !!v || "Geslacht moet ingevuld worden"],
      editUserMode: false,
      editOpleidingMode: false,
      opleidingen: [],
      opleidingnames: [],
      opleiding: undefined,
      deleteDialog: false,
      confirmDeleteDialog: false,
      activateDialog: false
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
      const gender = this.constants.genderKeys[this.userFields.gender];
      const roles = this.userFields.roles.map(r => this.constants.roleKeys[r]);
      await this.$http.updateUser({ ...this.user, gender, roles });
      await this.fetchUser();
    },
    async fetchUser() {
      const userId = this.$route.params.id;
      this.user = await this.$http.getUser(userId);

      this.userFields = Object.assign({}, this.user);
      this.userFields.gender = this.getKeyByValue(
        this.constants.genderKeys,
        this.user.gender
      );
      this.userFields.roles = this.user.roles.map(r =>
        this.getKeyByValue(this.constants.roleKeys, r)
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
  computed: mapGetters(["constants"])
};
</script>
