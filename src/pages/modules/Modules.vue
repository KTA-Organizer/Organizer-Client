<template>
<main v-if="module">
    <v-container v-if="editMode">
        <editablemodule v-bind:module="module" v-bind:edit.sync="editMode" v-on:confirm="refreshModule"> </editablemodule>
    </v-container>
    <v-container v-else>
        <v-layout row class="ml-5 mb-4">
            <h1 class="text-xs-left">Module: {{ module.name }}</h1>
            <v-flex xs5 v-if="isAdmin">
                <v-btn color="primary" @click="editMode = !editMode">
                    <v-icon dark>edit</v-icon>&nbsp;Aanpassen
                </v-btn>
                <v-menu offset-y>
                    <v-btn slot="activator" color="success" dark>
                        <v-icon light>control_point</v-icon>&nbsp;
                    </v-btn>
                    <v-list>
                        <v-list-tile v-for="(item) in insertPossibilities" :key="item" @click="showCorrectAddDialog(item)">
                            <v-list-tile-title>{{ item }}</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-menu offset-y>
                    <v-btn slot="activator" color="error" dark>
                        <v-icon light>remove_circle_outline</v-icon>&nbsp;
                    </v-btn>
                    <v-list>
                        <v-list-tile v-for="(item) in insertPossibilities" :key="item" @click="showCorrectRemoveDialog(item)">
                            <v-list-tile-title>{{ item }}</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-flex> 
        </v-layout>
        <modulelist :module="module"></modulelist>
    </v-container>
    <newdomaindialog v-bind:model.sync="addingDomain" :moduleId="module.id" v-on:confirm="refreshModule"></newdomaindialog>
    <newgoaldialog v-bind:model.sync="addingGoal" :moduleId="module.id" :module="module" v-on:confirm="refreshModule"></newgoaldialog>
    <newcriteriadialog v-bind:model.sync="addingCriteria" :moduleId="module.id" :module="module" v-on:confirm="refreshModule"></newcriteriadialog>
    <removedomaindialog v-bind:model.sync="removingDomain" :moduleId="module.id" :module="module" v-on:confirm="refreshModule"></removedomaindialog>
    <removegoaldialog v-bind:model.sync="removingGoal" :moduleId="module.id" :module="module" v-on:confirm="refreshModule"></removegoaldialog>
    <removecriteriadialog v-bind:model.sync="removingCriteria" :moduleId="module.id" :module="module" v-on:confirm="refreshModule"></removecriteriadialog>
</main>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: "Modules",
    data() {
        return {
            module: null,
            currentUserId: this.$store.getters.currentUser.id,
            editMode: false,
            insertPossibilities: ["Domein", "Doelstelling", "Criteria"],
            addingDomain: false,
            addingGoal: false,
            addingCriteria: false,
            removingDomain: false,
            removingGoal: false,
            removingCriteria: false,
        };
    },
    computed: mapGetters(["isAdmin"]),
    methods: {
        saveModule() {
            this.$http.updateModule(
                this.module.id,
                this.module.name
            );
        },
        async refreshModule(){
            this.module = await this.$http.getModule(
                this.module.id
            );
        },
        showCorrectAddDialog(choice){
            switch(choice){
                case "Domein":
                    this.addingDomain = true;
                    break;
                case "Doelstelling":
                    this.addingGoal = true;
                    break;
                case "Criteria":
                    this.addingCriteria = true;
                    break;
            }
        },
        showCorrectRemoveDialog(choice){
            switch(choice){
                case "Domein":
                    this.removingDomain = true;
                    break;
                case "Doelstelling":
                    this.removingGoal = true;
                    break;
                case "Criteria":
                    this.removingCriteria = true;
                    break;
            }
        }
    },
    async created() {
        const id = this.$route.params.moduleid;
        this.module = await this.$http.getModule(id);
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
