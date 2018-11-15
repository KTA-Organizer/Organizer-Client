<template>
<v-container>
    <v-layout wrap class="" dark v-for="(categorie) in module.domains" :value="categorie.active" v-bind:key="categorie.name">
        <h2 class="categorieTitle mb-4 text-xs-left" v-if="categorie.active">{{ categorie.name }}</h2>
        <v-layout row class="abc" v-if="categorie.active">
            <v-data-table hide-headers :items="categorie.goals" hide-actions class="elevation-1 criteriaTable mb-5">
                <template slot="items" slot-scope="props">
                    <tr v-if="props.item.active">
                        <th>{{ props.item.name }}</th>
                        <v-layout class="py-2 mt-2" v-for="(criteria) in props.item.criteria" v-bind:key="criteria.name" row>
                            <v-layout :class="getClass" v-if="criteria.active">
                                <v-flex>
                                    <td d-block class="text-xs-left pl-0 xs-5">{{ criteria.name }}</td>
                                    <v-divider></v-divider>
                                </v-flex>
                            </v-layout>
                            <template v-if="evaluating">

                                <v-spacer></v-spacer>

                                <v-btn class="primary" @click="createScoreDialog(evaluations, criteria.id)">
                                    <v-icon>remove_red_eye</v-icon> Bekijk vorige scores
                                </v-btn>

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
    <v-dialog width="500" v-model="showScores">
        <v-card>
            <v-card-title>
                <h3>Scores</h3>
            </v-card-title>
            <v-card-text>
                <table class="scores">
                    <tr>
                        <th>Opdracht</th>
                        <th>Score</th>
                    </tr>
                    <tr v-for="(score, key) in scoreObject" v-bind:key="key">
                        <td class="score"><strong>{{key}}</strong>:</td>
                        <td class="score">{{score}}</td>
                    </tr>
                </table>
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" @click="showScores = false">
                    <v-icon>clear</v-icon>Sluit
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</v-container>
</template>

<script>
import * as grades from "../../constants/grades";

export default {
    name: "moduleList",
    props: ["module", "evaluating", "evaluations", "newEvaluation"],
    data() {
        return {
            showScores: false,
            scoreObject: {},
        };
    },
    methods: {
        getEvalForCriteria(assignment, id) {
            let score = "NI";
            const grade = assignment.find(x => x.criteriaid === id);
            if (grade) {
                score = this.getKeyByValue(grades.gradeValues, grade.grade);
                score = grades.gradeKeys[score];
            }
            return score;
        },
        getKeyByValue(object, value) {
            return Object.keys(object).find(key => object[key] === value);
        },
        graded() {
            console.log(this.newEvaluation);
            this.$emit("graded");
        },
        createScoreDialog(evaluations, criteriaid) {
            this.scoreObject = {};
            evaluations.forEach((value, key) => {
                let score = this.getEvalForCriteria(value, criteriaid);
                this.scoreObject[key] = score;
            })
            console.log(this.scoreObject)
            this.showScores = true;
            // for (assignmentName in  Array.from(evaluations)) {
            //     console.log(assignmentName, assignments);
            //     // let x = this.getEvalForCriteria(assignments, criteriaid);
            //     // console.log(x);
            // }
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
.abc {
    width: 100%;
}

div.menu__content--autocomplete {
    top: 165px !important;
}

.criteriaTable {
    margin-bottom: 4%;
    width: 100%;
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

.scores.th {
    border: none;
    display: inline-block;
}

.scores {
    /* border: 1px solid black; */
    border-spacing: 0;
}

.score {
    padding: 1em;
    border: 1px black solid;
}

</style>
