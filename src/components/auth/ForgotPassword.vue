<template>
<v-flex>
    <v-toolbar dark color="primary">
        <v-toolbar-title>Wachtwoord vergeten</v-toolbar-title>
        <v-spacer></v-spacer>
    </v-toolbar>
    <v-card-text v-if="!passwordResetSuccess">
        <v-card-title>Stuur een email om je wachtwoord te herstellen.</v-card-title>
        <v-form>
            <v-text-field name="email" label="Email" id="email" type="email" :rules="emailRules" v-on:input="$emit('update:email', userMail)" v-model="userMail" autofocus="autofocus" required></v-text-field>
            <v-flex class="text-xs-center" mt-3>
                <v-btn color="primary" type="submit" v-on:click.prevent="onPasswordReset">Email versturen</v-btn>
                <p v-if="passwordResetError" class="red--text">{{passwordResetError}}</p>
            </v-flex>
        </v-form>
    </v-card-text>
    <v-card-text v-if="passwordResetSuccess">
        <v-card-title>Email verstuurt!</v-card-title>
    </v-card-text>
</v-flex>
</template>

                            

<script>
import * as rules from "../../constants/rules";

export default {
    name: "ForgotPassword",
    props: ["email"],
    data() {
        return {
            emailRules: rules.email,
            passwordResetSuccess: false,
            passwordResetError: null,
            userMail: ""
        };
    },
    methods: {
        async onPasswordReset() {
            try {
                await this.$http.requestPasswordReset(this.email);
                this.passwordResetSuccess = true;
            } catch (err) {
                this.passwordResetError = "Password reset request failed";
            }
        }
    },
    beforeUpdate() {
        this.userMail = this.email;
    }
};
</script>
