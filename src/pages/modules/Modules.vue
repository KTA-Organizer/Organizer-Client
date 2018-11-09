<template>
<main v-if="module">
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
                <h1 class="text-xs-left">{{ module.name }}</h1>
            </v-flex>
            <v-flex xs5>
                <v-btn color="primary" @click="editMode = !editMode">
                    <v-icon dark>edit</v-icon>Edit
                </v-btn>
                <v-menu offset-y>
                    <v-btn slot="activator" color="success" dark>
                        <v-icon light>control_point</v-icon>
                    </v-btn>
                    <v-list>
                        <v-list-tile v-for="(item) in insertPossibilities" :key="item" @click="showCorrectAddDialog(item)">
                            <v-list-tile-title>{{ item }}</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-menu offset-y>
                    <v-btn slot="activator" color="error" dark>
                        <v-icon light>remove_circle_outline</v-icon>
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
            removingDomain: false,
            removingGoal: false,
            removingCriteria: false,
        };
    },
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
                case "Categorie":
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
                case "Categorie":
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
