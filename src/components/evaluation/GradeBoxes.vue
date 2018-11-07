<template>
    <v-select class="grade" :id="criteriaid" label="Punt" :items="grades.grades" xs1></v-select>
</template>

<script>
import * as grades from "../../constants/grades";
export default {
    name: "GradeBoxes",
    props: ["criteriaid"],
    data() {
        return {
            grades: grades
        };
    }
};
</script>

<style scoped>
.grade {
    margin-top: 0;
    padding-top: 0;
}
</style>
