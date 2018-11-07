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
                            <loginform></loginform>
                            <p><a v-on:click="forgotPassword">Wachtwoord vergeten?</a></p>
                        </v-card>

                        <v-card v-if="showPasswordReset" class="elevation-12">
                            <forgotpassword v-bind:email.sync="email"></forgotpassword>
                            <p><a v-on:click="forgotPassword">Ooops... Ik weet het toch nog!</a></p>
                        </v-card>

                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-layout>
</v-app>
</template>

<script>
import * as rules from "../../constants/rules";
export default {
  name: "Login",
  data: () => ({
    email: "admin@test.test",
    password: "test",
    showPasswordReset: false
  }),
  methods: {
    onLogin() {
      this.$store.dispatch("login", {
        email: this.email,
        password: this.password
      });
    },
    forgotPassword() {
      this.showPasswordReset = !this.showPasswordReset;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* TODO custom css for the logo to fit the drawer */
</style>
