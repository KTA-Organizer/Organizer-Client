<template>
<main>
    <v-layout row-wrap>
        <v-flex xs12 offset-xs1 class="text-xs-left">
            <h1 class="display-3">{{ 'Modules' }}</h1>
        </v-flex>
    </v-layout>
    <v-container v-if="editMode">
        <editablemodule v-bind:module="module" v-bind:edit.sync="editMode"> </editablemodule>
    </v-container>
    <v-container v-else>
        <v-layout row class="ml-5 mb-4">
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
                <v-btn color="primary" @click="editMode = !editMode">
                    <v-icon dark>edit</v-icon>Edit
                </v-btn>
                <v-menu offset-y>
                    <v-btn slot="activator" color="primary" dark>
                        <v-icon light>control_point</v-icon>
                    </v-btn>
                    <v-list>
                        <v-list-tile v-for="(item) in insertPossibilities" :key="item" @click="showCorrectDialog(item)">
                            <v-list-tile-title>{{ item }}</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-flex> 
        </v-layout>
        <modulelist :module="module"></modulelist>
    </v-container>
    <newdomaindialog v-bind:model.sync="addingDomain" :moduleId="module.id" v-on:confirm="refreshModule"></newdomaindialog>
    <newgoaldialog v-bind:model.sync="addingGoal" :moduleId="module.id" v-on:confirm="refreshModule"></newgoaldialog>
    <newcriteriadialog v-bind:model.sync="addingCriteria" :moduleId="module.id" v-on:confirm="refreshModule"></newcriteriadialog>
</main>
</template>

<script>
export default {
    name: "Modules",
    data() {
        return {
            module: null,
            currentUserId: this.$store.getters.currentUser.id,
            editMode: false,
            insertPossibilities: ["Categorie", "Doelstelling", "Criteria"],
            addingDomain: false,
            addingGoal: false,
            addingCriteria: false,
        };
    },
    methods: {
        saveModule() {
            var self = this;
            self.$http.updateModule(
                this.module.id,
                this.module.name
            );
        },
        async refreshModule(){
            var self = this;
            this.module = await self.$http.getModule(
                this.module.id
            );
        },
        showCorrectDialog(choice){
            var self = this;
            switch(choice){
                case "Categorie":
                    self.addingDomain = true;
                    break;
                case "Doelstelling":
                    self.addingGoal = true;
                    break;
                case "Criteria":
                    self.addingCriteria = true;
                    break;
            }
        }
    },
    async created() {
        var self = this;
        const moduleFetched = await this.$http.getModule(parseInt(this.$route.query.id));
        this.module = moduleFetched;
        console.log(moduleFetched);
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
div.menu__content--autocomplete {
    top: 165px !important;
}

.criteriaTable {
    margin-bottom: 4%;
    max-width: 50%;
}

.categorieTitle {
    margin-bottom: 2%;
    width: 100%;
}
</style>
