<template>
<v-app>
  <v-toolbar color="indigo" dark fixed app>
    <v-toolbar-title>Rapportensysteem</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>
  <v-layout column>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>

            <v-card v-if="!showPasswordReset" class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Aanmelden</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field name="email" label="Email" id="email" type="email" :rules="emailRules" v-model="email" autofocus="autofocus" required></v-text-field>
                  <v-text-field name="paswoord" label="Paswoord" id="password" type="password" :rules="passwordRules" v-model="password" required></v-text-field>
                  <v-flex class="text-xs-center" mt-3>
                    <p><a v-on:click="forgotPassword">Wachtwoord vergeten?</a></p>
                    <v-btn color="primary" type="submit" v-on:click.prevent="onLogin">Aanmelden</v-btn>
                    <p v-if="loginError" class="red--text">{{loginError}}</p>
                  </v-flex>
                </v-form>
              </v-card-text>
            </v-card>

            <v-card v-if="showPasswordReset" class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Wachtwoord vergeten</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text v-if="!passwordResetSuccess">
                <v-card-title>Stuur een email om je wachtwoord te herstellen.</v-card-title>
                <v-form>
                  <v-text-field name="email" label="Email" id="email" type="email" :rules="emailRules" v-model="email" autofocus="autofocus" required></v-text-field>
                  <v-flex class="text-xs-center" mt-3>
                    <v-btn color="primary" type="submit" v-on:click.prevent="onPasswordReset">Email versturen</v-btn>
                    <p v-if="passwordResetError" class="red--text">{{passwordResetError}}</p>
                  </v-flex>
                </v-form>
              </v-card-text>
              <v-card-text v-if="passwordResetSuccess">
                <v-card-title>Email verstuurt!</v-card-title>
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
    email: "kenny.depecker@student.howest.be",
    password: "test",

    passwordRules: [v => !!v || "paswoord moet ingevuld worden"],
    emailRules: [
      v => !!v || "E-mail moet ingevuld worden",
      v =>
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
      "E-mail moet geldig zijn"
    ],
    loginError: null,

    showPasswordReset: false,
    passwordResetSuccess: false,
    passwordResetError: null
  }),
  methods: {
    onLogin() {
      this.$store.dispatch("login", {
        email: this.email,
        password: this.password
      });
    },
    forgotPassword() {
      this.showPasswordReset = true;
    },
    async onPasswordReset() {
      try {
        await this.$http.requestPasswordReset(this.email);
        this.passwordResetSuccess = true;
      } catch(err) {
        this.passwordResetError = "Password reset request failed";
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* TODO custom css for the logo to fit the drawer */
</style>
