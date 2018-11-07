<template>
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
            <h2 class="categorieTitle text-xs-left"> <v-text-field name="categorienaam" label="Naam van de categorie" v-model="categorie.name"></v-text-field></h2>
            <v-data-table hide-headers :items="categorie.goals" hide-actions class="elevation-1 criteriaTable">
                <template slot="items" slot-scope="props">
                    <tr>
                        <th><v-text-field name="doelstellingnaam" label="Naam van de doelstelling" v-model="props.item.name"></v-text-field></th>
                        <v-flex d-flex xs48 sm24 md12>
                            <v-layout row wrap>
                                <v-flex d-flex>
                                    <v-layout row wrap>
                                        <v-flex  v-for="(criteria) in props.item.criteria" v-bind:key="criteria.name" d-flex xs12>
                                            <div><td class="text-xs-left"><v-text-field name="criterianaam" label="Naam van de criteria" v-model="criteria.name"></v-text-field></td></div>
                                            <v-divider></v-divider>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </tr>
                </template>
            </v-data-table>
        </v-layout>

    </v-container>
</template>
<script>
export default {
    name: "editableModule",
    props: ["module"]
}
</script>
