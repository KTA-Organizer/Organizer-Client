<template>
  <v-app>
    <v-layout column>
      <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Sign in</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                        name="email"
                        label="Email"
                        id="email"
                        type="email"
                        :rules="emailRules"
                        v-model="email"
                        autofocus="autofocus"
                        required></v-text-field>
                  <v-text-field
                          name="paswoord"
                          label="Password"
                          id="password"
                          type="password"
                          :rules="passwordRules"
                          v-model="password"
                          required></v-text-field>
                          <v-flex class="text-xs-center" mt-5>
                            <v-btn color="primary" type="submit" v-on:click.prevent="onLogin">Sign In</v-btn>
                            <p v-if="loginError" class="red--text">{{loginError}}</p>
                          </v-flex>
                </v-form>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    </v-layout>
  </v-app>
</template>


<script>
export default {
  name: "Login",
  data: () => ({
    password: "test",
    passwordRules: [v => !!v || "paswoord moet ingevuld worden"],
    email: "kenny.depecker@student.howest.be",
    emailRules: [
      v => !!v || "E-mail moet ingevuld worden",
      v =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        "E-mail moet geldig zijn"
    ],
    loginError: null
  }),
  methods: {
    onLogin() {
      this.$store.dispatch("login", {
        email: this.email,
        password: this.password
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* TODO custom css for the logo to fit the drawer */
</style>
