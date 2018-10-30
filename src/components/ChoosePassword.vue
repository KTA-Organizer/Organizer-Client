<template>
<v-app>
  <v-toolbar color="indigo" dark fixed app>
    <v-toolbar-title>Wachtwoord</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>
  <v-layout column>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Nieuw Wachtwoord instellen</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field name="paswoord" label="Nieuw Wachtwoord" id="password" type="password" :rules="passwordRules" v-model="password" required></v-text-field>
                  <v-text-field name="passwordRepeat" label="Herhaal Wachtwoord" id="passwordRepeat" type="password" :rules="passwordRepeatRules" v-model="passwordRepeat" required></v-text-field>
                  <v-flex class="text-xs-center" mt-3>
                    <v-btn color="primary" type="submit" v-on:click.prevent="onSubmit">Klaar</v-btn>
                    <p v-if="failure" class="red--text">{{submitFailure}}</p>
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
  name: "ChoosePassword",
  data: function () {
    return ({
      accessToken: "",
      password: "",
      passwordRepeat: "",
      passwordRules: [
        v => !!v || "Paswoord moet ingevuld worden",
        v => v.length >= 6 || "Paswoord moet minstens 6 karakters bevatten"
      ],
      passwordRepeatRules: [
        v => !!v || "Voer u wachtwoord hier nog een keer in",
        v => v === this.password || "Uw wachtwoorden komen niet overeen"
      ],
      submitFailure: "Password reset failed.",
      succes: false,
      failure: false,
    })
  },
  methods: {
    async onSubmit() {
      let method = {
        "reset": this.$http.resetPassword,
        "invitation": this.$http.acceptInvitation,
      }[this.$route.name];
      try {
        await method(this.accessToken, this.password);
        this.succes = true;
        this.$router.push("/login");
      } catch (err) {
        this.failure = true;
      }
    }
  },
  created() {
    this.accessToken = this.$route.query.token;
    if (!this.accessToken) {
      this.$router.push("/login");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* TODO custom css for the logo to fit the drawer */
</style>
