<template>
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
</template>

<script>
import * as rules from "../../constants/rules";

export default {
    name: "SetPassword",
    props: ["accessToken"],
    data() {
        return {
            password: "",
            passwordRepeat: "",
            passwordRules: rules.password,
            passwordRepeatRules: [ // TODO this can't be abstracted because we need this.password
                v => !!v || "Voer u wachtwoord hier nog een keer in",
                v => v === this.password || "Uw wachtwoorden komen niet overeen"
            ],
            submitFailure: "Password reset failed.",
            failure: false,
            succes: false
        };
    },
    methods: {
        async onSubmit() {
            try {
                await this.$http.putNewPassword(this.accessToken.token, this.password);
                this.succes = true;
                this.$router.push("/login");
            } catch (err) {
                this.failure = true;
            }
        }
    }
};
</script>
