<template>
<v-container>
    <v-layout wrap class="" dark v-for="(categorie) in module.domains" :value="categorie.active" v-bind:key="categorie.name">
        <h2 class="categorieTitle mb-4 text-xs-left">{{ categorie.name }}</h2>
        <v-layout row>
            <v-data-table hide-headers :items="categorie.goals" hide-actions class="elevation-1 criteriaTable mb-5">
                <template slot="items" slot-scope="props">
                    <tr>
                        <th>{{ props.item.name }}</th>
                        <v-layout class="py-2 mt-2" v-for="(criteria) in props.item.criteria" v-bind:key="criteria.name" row>
                            <v-layout :class="getClass">
                                <v-flex>
                                    <td d-block class="text-xs-left pl-0 xs-5">{{ criteria.name }}</td>
                                    <v-divider></v-divider>
                                </v-flex>
                            </v-layout>
                            <template v-if="evaluating">

                                <v-flex class="scores">
                                    <td xs1 class="score" v-for="[assignmentName, assignments] in Array.from(evaluations)" v-bind:key="assignmentName">
                                        {{getEvalForCriteria(assignments, criteria.id)}}
                                        <small>{{assignmentName}}</small>
                                    </td>
                                </v-flex>

                                <v-spacer></v-spacer>

                                <td v-if="evaluating" class="gradeBox">
                                    <gradeboxes :criteriaid="criteria.id" :newEvaluation="newEvaluation" v-on:graded="graded"></gradeboxes>
                                </td>
                            </template>
                        </v-layout>
                    </tr>
                </template>
            </v-data-table>
        </v-layout>
    </v-layout>
</v-container>
</template>

<script>
import * as grades from "../../constants/grades";
import * as helper from "../../constants/helpers";

export default {
    name: "moduleList",
    props: ["module", "evaluating", "evaluations", "newEvaluation"],
    data() {
        return {
        };
    },
    methods: {
        getEvalForCriteria(assignment, id) {
            let score = "NI";
            const grade = assignment.find(x => x.criteriaid === id);
            if (grade) {
                score = helper.getKeyByValue(grades.gradeValues, grade.grade);
                score = grades.gradeKeys[score];
            }
            return score;
        },
        graded() {
            console.log(this.newEvaluation);
            this.$emit("graded");
        }
    },
    computed: {
        getClass() {
            return this.evaluating ? "criteriaTextSm" : "criteriaText";
        }
    }
};
</script>

<style scoped>
div.menu__content--autocomplete {
    top: 165px !important;
}

.criteriaTable {
    margin-bottom: 4%;
}

.categorieTitle {
    width: 100%;
}

.criteriaTextSm {
    width: 30%;
}

.criteriaText {
    width: 80%;
}

.gradeBox {
    max-width: 15%;
}

.scores {
    width: 20%;
}

.score:not(:last-child) {
    border-right: 1px black dashed;
}

table tr td.score {
    width: 15%;
}
</style>
