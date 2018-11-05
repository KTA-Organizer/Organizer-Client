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
                        <setpassword :accesToken="accesToken"></setpassword>
                        <v-card v-if="!!accessToken" class="elevation-12">
                            <v-toolbar dark color="primary">
                                <v-toolbar-title>Wachtwoord instellen voor {{accessToken.user.firstname}}</v-toolbar-title>
                                <v-spacer></v-spacer>
                            </v-toolbar>
                            <v-card-text>
                                <v-card-title v-if="accessToken.type === 'INVITATION'">Welkom {{accessToken.user.firstname}}, om te beginnen op het platform moet je een wachtwoord instellen.</v-card-title>
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
import * as rules from "../../constants/rules";

export default {
    name: "ChoosePassword",
    data: function () {
        return {
            accessToken: undefined,
            succes: false,
            failure: false
        };
    },
    async created() {
        const hash = this.$route.query.token;
        if (!hash) {
            this.$router.push("/login");
            return;
        }
        try {
            this.accessToken = await this.$http.getAccessToken(hash);
        } catch (err) {
            this.$router.push("/login");
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/* TODO custom css for the logo to fit the drawer */
</style>
