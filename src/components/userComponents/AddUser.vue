<template>
  <div>
    <v-flex xs12 offset-xs1 class="text-xs-left">
          <h1 class="display-3">toevoegen</h1>
    </v-flex>
    <v-layout row wrap>
        <v-flex xs10 offset-xs1>
          <v-form v-model="valid" ref="form" lazy-validation>
            <v-text-field
              label="Voornaam"
              v-model="firstname"
              :rules="firstnameRules"
              required
              :autofocus="true"
            ></v-text-field>
            <v-text-field
                label="Naam"
                v-model="name"
                :rules="nameRules"
                required
            ></v-text-field>
            <v-text-field
              label="E-mail"
              v-model="email"
              :rules="emailRules"
              required
            ></v-text-field>
            <v-select
              label="Geslacht"
              v-model="gender"
              :rules="selectRules"
              required
              :items="genders"
            ></v-select>
            <v-select
              label="Rol"
              v-model="role"
              :rules="selectRules"
              required
              :items="roles"
            ></v-select>
            <router-link to="/Gebruikers"><v-btn color="secondary">Terug naar overzicht</v-btn></router-link>
            <v-btn color="primary" :disabled="!valid" @click="createUser">Voltooien</v-btn>
          </v-form>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import store from "../../store/index";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      valid: true,
      firstname: "",
      name: "",
      email: "",
      gender: undefined,
      role: undefined,
      genders: [],
      genderKeys: {},
      roles: [],
      roleKeys: {},
      firstnameRules: [v => !!v || "Voornaam moet ingevuld worden"],
      nameRules: [v => !!v || "Naam moet ingevuld worden"],
      emailRules: [
        v => !!v || "E-mail moet ingevuld worden",
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail moet geldig zijn"
      ],
      selectRules: [v => !!v || "Veld moet ingevuld worden"],
    };
  },
  methods: {
    async createUser() {
      const newUser = {
        firstname: this.firstname,
        lastname: this.name,
        email: this.email,
        gender: this.genderKeys[this.gender],
        role: this.roleKeys[this.role],
      };
      console.log(newUser);
      const userIdObj = await this.$http.createUser(newUser);
      // const userId = 1;
      this.$router.push(`${userIdObj.newId}`);
    }
  },
  created() {
    console.log(this.constants);
    this.genders = this.constants.genders;
    this.genderKeys = this.constants.genderKeys;
    this.roles = this.constants.roles;
    this.roleKeys = this.constants.roleKeys;
  },
  computed: mapGetters(["isLoggedIn", "currentUser", "constants"])
};
</script>
