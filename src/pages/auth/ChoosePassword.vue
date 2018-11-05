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
                        <setpassword :accessToken="accessToken"></setpassword>
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
