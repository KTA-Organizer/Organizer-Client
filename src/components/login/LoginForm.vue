<template>
<v-flex>
    <v-toolbar dark color="primary">
        <v-toolbar-title>Aanmelden</v-toolbar-title>
        <v-spacer></v-spacer>
    </v-toolbar>
    <v-card-text>
        <v-form>
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
export default {
    name: "LoginForm",
    data() {
        return {
            loginError: null,
            email: "kenny.depecker@student.howest.be",
            password: "test",
            passwordRules: [v => !!v || "paswoord moet ingevuld worden"],
            emailRules: [
                v => !!v || "E-mail moet ingevuld worden",
                v =>
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                "E-mail moet geldig zijn"
            ]
        };
    },
    methods: {
        // forgotPassword() {
        //   console.log(this.showPasswordReset);
        //   this.showPasswordReset = true;
        // },
        onLogin() {
            this.$store.dispatch("login", {
                email: this.email,
                password: this.password
            });
        }
    }
};
</script>
