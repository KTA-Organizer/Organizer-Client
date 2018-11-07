<template>
<main>
    <v-layout row-wrap>
        <v-flex xs12 offset-xs1 class="text-xs-left">
            <h1 class="display-3">{{ 'Modules' }}</h1>
        </v-flex>
    </v-layout>
    <v-container>
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
            </v-flex>
        </v-layout>
        <v-layout wrap class="ml-5" dark v-for="(categorie) in module.domains" :value="categorie.active" v-bind:key="categorie.name">
            <h2 class="categorieTitle">{{ categorie.name }}</h2>
            <v-data-table hide-headers :items="categorie.goals" hide-actions class="elevation-1 criteriaTable">
                <template slot="items" slot-scope="props">
                    <tr>
                        <th>{{ props.item.name }}</th>
                        <td class="text-xs-left" v-for="(criteria) in props.item.criteria" v-bind:key="criteria.name">{{ criteria.name }}</td>
                    </tr>
                </template>
            </v-data-table>
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
        const moduleFetched = await this.$http.getModule(parseInt(this.$route.query.id));
        this.module = moduleFetched; 
        console.log(moduleFetched);
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
div.menu__content--autocomplete {top:165px !important;}

.criteriaTable{
    margin-bottom: 4%;
}
.categorieTitle{
    margin-bottom: 2%;
}
</style>

