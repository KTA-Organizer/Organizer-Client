<template>
<v-flex>
    <v-toolbar dark color="primary">
        <v-toolbar-title>Aanmelden</v-toolbar-title>
        <v-spacer></v-spacer>
    </v-toolbar>
    <v-card-text>
        <v-form>
            <p style="color: red" v-if="hasFailedLogin">Uw email of wachtwoord is niet correct!</p>
            <v-text-field name="email" label="Email" id="email" type="email" :rules="emailRules" v-model="email" autofocus="autofocus" required></v-text-field>
            <v-text-field name="paswoord" label="Paswoord" id="password" type="password" :rules="passwordRules" v-model="password" required></v-text-field>
            <v-flex class="text-xs-center" mt-3>
                <v-btn color="primary" type="submit" v-on:click.prevent="onLogin">Aanmelden</v-btn>
            </v-flex>
        </v-form>
    </v-card-text>
</v-flex>
</template>

<script>
import * as rules from "../../constants/rules";
import { mapGetters } from 'vuex';

export default {
    name: "LoginForm",
    data() {
        return {
            email: "",
            password: "",
            passwordRules: rules.password,
            emailRules: rules.email,
        };
    },
    computed: mapGetters(["hasFailedLogin"]),
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
