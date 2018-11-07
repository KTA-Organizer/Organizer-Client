<template>
    <v-container>
        
        <v-layout wrap class="ml-5" dark v-for="(categorie) in module.domains" :value="categorie.active" v-bind:key="categorie.name">
            <h2 class="categorieTitle text-xs-left">{{ categorie.name }}</h2>
            <v-data-table hide-headers :items="categorie.goals" hide-actions class="elevation-1 criteriaTable">
                <template slot="items" slot-scope="props">
                    <tr>
                        <th>{{ props.item.name }}</th>
                        <v-flex d-flex xs48 sm24 md12>
                            <v-layout row wrap>
                                <v-flex d-flex>
                                    <v-layout row wrap>
                                        <v-flex  v-for="(criteria) in props.item.criteria" v-bind:key="criteria.name" d-flex xs12>
                                            <div><td class="text-xs-left">{{ criteria.name }}</td></div>
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
    name: "moduleList",
    props: ["module"]
}
</script>
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
    width:100%;
}
</style>

