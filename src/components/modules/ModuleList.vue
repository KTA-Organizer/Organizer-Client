<template>
<v-container>
    <v-layout wrap class="" dark v-for="(categorie) in module.domains" :value="categorie.active" v-bind:key="categorie.name">
        <h2 class="categorieTitle mb-4 text-xs-left" v-if="categorie.active">{{ categorie.name }}</h2>
        <v-layout row class="" v-if="categorie.active">
            <v-data-table hide-headers :items="categorie.goals" hide-actions class="elevation-1 criteriaTable mb-5">
                <template slot="items" slot-scope="props">
                    <tr v-if="props.item.active">
                        <th>{{ props.item.name }}</th>
                        <v-layout class="py-2 mt-2" v-for="(criteria) in props.item.criteria" v-bind:key="criteria.name" row>
                            <v-layout class="criteriaText">
                                <v-flex>
                                    <div>
                                        <td class="text-xs-left pl-0 xs-5">{{ criteria.name }}</td>
                                    </div>
                                    <v-divider></v-divider>
                                </v-flex>
                            </v-layout>
                            <v-spacer></v-spacer>
                            <td v-if="evaluating" class="gradeBox">
                                <gradeboxes :criteriaid="criteria.id"></gradeboxes>
                            </td>
                        </v-layout>
                    </tr>
                </template>
            </v-data-table>
        </v-layout>
    </v-layout>
</v-container>
</template>

<script>
export default {
    name: "moduleList",
    props: ["module", "evaluating"],
    data() {
        return {}
    }
}
</script>

<style scoped>
div.menu__content--autocomplete {
    top: 165px !important;
}

.criteriaTable {
    margin-bottom: 4%;
    max-width: 90%;
}

.categorieTitle {
    width: 100%;
}

.criteriaText {
    max-width: 70%;
}

.gradeBox {
    max-width: 30%;
}
</style>
