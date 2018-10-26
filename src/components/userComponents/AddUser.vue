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
              required
              :items="genders"
            ></v-select>
          </v-form>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      valid: true,
      name: "",
      nameRules: [v => !!v || "Naam moet ingevuld worden"],
      firstname: "",
      firstnameRules: [v => !!v || "Voornaam moet ingevuld worden"],
      email: "",
      gender: "",
      genders: ["Man", "Vrouw"],
      genderKeys: {
        Man: "M",
        Vrouw: "F"
      },
      emailRules: [
        v => !!v || "E-mail moet ingevuld worden",
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail moet geldig zijn"
      ]
    };
  }
};
</script>
