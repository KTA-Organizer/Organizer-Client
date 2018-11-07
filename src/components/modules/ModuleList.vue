<template>
<v-container>
    <v-layout wrap class="" dark v-for="(categorie) in module.domains" :value="categorie.active" v-bind:key="categorie.name">
        <h2 class="categorieTitle text-xs-left">{{ categorie.name }}</h2>
        <v-layout row class="">
            <v-data-table hide-headers :items="categorie.goals" hide-actions class="elevation-1 criteriaTable">
                <template slot="items" slot-scope="props">
                    <tr>
                        <th>{{ props.item.name }}</th>
                        <v-layout v-for="(criteria) in props.item.criteria" v-bind:key="criteria.name" row>
                            <v-layout class="criteriaText">
                                <v-flex>
                                    <div>
                                        <td class="text-xs-left pl-0 pt-2 pb-1 xs-5">{{ criteria.name }}</td>
                                    </div>
                                    <v-divider></v-divider>
                                </v-flex>
                            </v-layout>
                            <v-spacer></v-spacer>
                            <td class="gradeBox"><gradeboxes :criteriaid="criteria.id"></gradeboxes></td>
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
    props: ["module"]
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
    margin-bottom: 2%;
    width: 100%;
}

.criteriaText {
    max-width: 70%;
}

.gradeBox {
    max-width: 30%;
}
</style>
