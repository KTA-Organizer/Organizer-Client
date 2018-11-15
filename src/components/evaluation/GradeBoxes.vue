<template>
    <v-select no-data-text="Geen data beschikbaar" v-model="score" class="grade" :id="`${criteriaid}`" label="Score" :items="grades.grades" xs1 v-on:input="addScore"></v-select>
</template>

<script>
import * as grades from "../../constants/grades";
export default {
    name: "GradeBoxes",
    props: ["criteriaid", "newEvaluation"],
    data() {
        return {
            grades: grades,
            score: "",
        };
    },
    methods: {
        addScore() {
            const scoreName = this.getKeyByValue(grades.gradeKeys, this.score);
            const scoreValue = grades.gradeValues[scoreName];
            if (!scoreValue) {
                delete this.newEvaluation[this.criteriaid];
            } else {
                this.newEvaluation[this.criteriaid] = scoreValue;
            }
            this.$emit('graded');
        },
        getKeyByValue(object, value) {
            return Object.keys(object).find(key => object[key] === value);
        },
    }
};
</script>

<style scoped>
.grade {
    margin-top: 0;
    padding-top: 0;
}
</style>
