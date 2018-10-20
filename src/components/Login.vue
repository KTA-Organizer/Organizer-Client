<template>
  <v-app>
    <v-layout column>
        <v-flex xs4 offset-xs4>
          <form>
            <v-flex xs12 class="text-xs-center" mt-5>
              <h3>Sign In</h3>
            </v-flex>
            <v-layout column>
              <v-flex>
                <v-text-field
                        name="email"
                        label="Email"
                        id="email"
                        type="email"
                        :rules="emailRules"
                        v-model="email"
                        autofocus="autofocus"
                        required></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field
                        name="paswoord"
                        label="Password"
                        id="password"
                        type="password"
                        :rules="passwordRules"
                        v-model="password"
                        required></v-text-field>
              </v-flex>
              <v-flex class="text-xs-center" mt-5>
                <v-btn color="primary" type="submit" v-on:click.prevent="onLogin">Sign In</v-btn>
                <p v-if="loginError" class="red--text">{{loginError}}</p>
              </v-flex>
            </v-layout>
          </form>
        </v-flex>
    </v-layout>
  </v-app>
</template>


<script>
export default {
  name: "Login",
  data: () => ({
    password: "test",
    passwordRules: [v => !!v || "paswoord moet ingevuld worden"],
    email: "student1@hotmail.com",
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
      this.$store.dispatch("login", { email: this.email, password: this.password });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* TODO custom css for the logo to fit the drawer */
</style>
