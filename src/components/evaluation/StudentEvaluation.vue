<template>
<v-container>
    <v-layout align-center>
        <img class="" src="../../assets/Logos_CLW_KTA_ZWAAN.png" height="100%" >
        <v-spacer></v-spacer>
        <h1>Evaluatiefiche opleiding {{discipline.name}}</h1>
    </v-layout>
    <v-layout row>
        <table id="headerTable" cellspacing="0">
            <th>Info</th>
            <tr>
                <td>Naam: <strong>{{student.lastname}}</strong></td>
                <td>Schooljaar: <strong>{{createSchoolyear()}}</strong></td>
            </tr>
            <tr>
                <td>Voornaam: <strong>{{student.firstname}}</strong></td>
                <td>Leerkracht: <strong>{{currentUser.firstname}} {{currentUser.lastname}}</strong></td>
            </tr>
        </table>
        <v-spacer></v-spacer>
        <table id="headerTable" cellspacing="0">
            <th>Legende</th>
            <tr>
                <td v-for="key in Object.keys(gradeKeys)" v-bind:key="key">{{gradeKeys[key]}}</td>
            </tr>
            <tr>
                <td v-for="key in Object.keys(gradeKeys)" v-bind:key="key">{{key}}</td>
            </tr>
        </table>
    </v-layout>
    <v-text-field v-model="assignmentName" label="Naam van de opdracht" required :rules="nameRules"></v-text-field>
    <v-layout row>
        <modulelist :module="module" :evaluating="true" :evaluations="evaluationsPerAssignment"></modulelist>
    </v-layout>
    <v-btn color="primary"><v-icon>save</v-icon> Opslaan</v-btn>
</v-container>
</template>

<script>
import moment from "moment";
import { mapGetters } from 'vuex';

import {
    name as nameRules
} from "../../constants/rules";
import {
    gradeKeys
} from "../../constants/grades";

export default {
    name: "StudentEvaluation",
    data() {
        return {
            student: {},
            module: {},
            discipline: {},
            assignmentName: "",
            nameRules: nameRules,
            evaluations: [],
            evaluationsPerAssignment: new Map(),
            gradeKeys: gradeKeys,
        };
    },
    methods: {
        createSchoolyear() {
            const date =
                moment().month() + 1 >= 9 // September indicates new schoolyear
                ?
                `${moment().format("YYYY")} - ${moment().add(1, "y").format("YYYY")}` :
                `${moment().subtract(1).format("YYYY")} - ${moment().format("YYYY")}`;
            return date;
        }
    },
    async created() {
        const studentId = this.$route.params.studentId;
        const moduleId = this.$route.params.moduleId;
        this.student = await this.$http.getUser(studentId);
        this.module = await this.$http.getModule(moduleId);
        this.discipline = await this.$http.getOpleidingForStudent(studentId);
        this.evaluations = await this.$http.getEvalsForStudentInModule(studentId, moduleId)
        this.evaluationsPerAssignment = this.evaluations.reduce((acc, evaluation, index) => {
            if (acc.get(evaluation.name)) {
                acc.get(evaluation.name).push(evaluation);
            } else {
                acc.set(evaluation.name, [evaluation]);
            }
            return acc;
        }, new Map());
        console.log(this.evaluationsPerAssignment)
    },
    computed: mapGetters(["currentUser"])
};
</script>

<style scoped>
#headerTable {
    margin-top: 1em;
}

#headerTable td {
    border: 1px black solid;
    box-sizing: border-box !important;
    margin: 0;
    padding: 1em;
}

#headerTable td.together {
    border: 0;
}

#headerTable tr td.togetherTop {
    border-bottom: 0;
}

#headerTable tr td.togetherBottom {
    border-top: 0;
}
</style>
