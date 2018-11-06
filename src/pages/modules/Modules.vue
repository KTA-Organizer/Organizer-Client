<template>
<main>
    <v-layout row-wrap>
        <v-flex xs12 offset-xs1 class="text-xs-left">
            <h1 class="display-3">{{ 'Modules' }}</h1>
        </v-flex>
    </v-layout>
    <v-container>
        <v-layout row class="ml-5">
            <v-flex xs4>
                <v-text-field name="modulenaam" label="Naam van de module" v-model="module.name" single-line></v-text-field>
            </v-flex>
            <v-flex xs5>
                <v-btn color="success" @click.native="saveModule">
                    Opslaan
                    <span slot="loader" class="custom-loader">
                    <v-icon light>cached</v-icon>
                    </span>
                </v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</main>
</template>

<script>
export default {
    name: "Modules",
    data() {
        return {
            module: null,
            currentUserId: this.$store.getters.currentUser.id
        };
    },
    methods: {
        saveModule(){
            var self = this;
            self.$http.updateModule(
                        this.module.id,
                        this.module.name
                    );
        }
    },
    async created() {
        var self = this;
        this.module = await this.$http.getModule(parseInt(this.$route.query.id));
        console.log(module);
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
div.menu__content--autocomplete {top:165px !important;}
</style>

