<template>
<v-container>
    <v-layout align-center>
        <img class="" src="../../assets/Logos_CLW_KTA_ZWAAN.png" height="100%" >
        <v-spacer></v-spacer>
        <v-layout column>
            <h1 class="text-xs-right">Evaluatiefiche opleiding {{discipline.name}}</h1>
            <h1 class="text-xs-right">Module: {{module.name}}</h1>
        </v-layout>
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
    <v-layout class="mt-3 xs-12">
        <v-form class="xs-6" ref="form" lazy-validation v-if="isEditable">
            <v-text-field v-model="assignmentName" label="Naam van de opdracht" required :rules="nameRules"></v-text-field>
        </v-form>
        <v-btn class="xs-6" color="primary" @click="createReport">Maak een rapport voor deze evaluatie</v-btn>
    </v-layout>
    <v-layout row>
        <modulelist :module="module" :evaluating="isEditable" :evaluations="evaluationsPerAssignment" :newEvaluation="newEvaluation" v-on:graded="graded"></modulelist>
    </v-layout>
    <v-btn v-if="isEditable" color="primary" @click="saveEvaluation">
        <v-icon>save</v-icon> Opslaan
    </v-btn>
</v-container>
</template>

<script>
import moment from "moment";
import {
    mapGetters
} from 'vuex';

import {
    name as nameRules
} from "../../constants/rules";
import {
    gradeKeys
} from "../../constants/grades";
import pdfMake from "pdfmake/build/pdfmake.min.js";

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
            newEvaluation: {},
            evaluationsheet: {},
            evaluationid: -1,
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
        },
        graded() {
            console.log("in evaluation", this.newEvaluation);
        },
        async saveEvaluation() {
            if (!this.$refs.form.validate()) {
                window.scrollTo(0, 0);
                return;
            };
            if (Object.keys(this.newEvaluation).length < 1) {
                alert("Vul minstens 1 punt in");
                window.scrollTo(0, 0);
                return;
            }
            const newEvaluationObj = {
                evaluations: []
            }
            for (const score of this.evaluationsheet.scores) {
                newEvaluationObj.evaluations.push({
                    name: score.name,
                    grade: score.grade,
                    criteriaid: score.criteriaid,
                    creation: moment(score.creation).format("YYYY-MM-DD HH-mm-ss")
                })
            }
            for (const criteriaid in this.newEvaluation) {
                const grade = this.newEvaluation[criteriaid];
                const score = {
                    name: this.assignmentName,
                    grade,
                    criteriaid: +criteriaid,
                }
                newEvaluationObj.evaluations.push(score);
            }
            console.log(newEvaluationObj);
            await this.$http.saveEvaluation(this.evaluationid, newEvaluationObj);
        },
        async createReport() {
            const reportid = await this.$http.createReport(this.evaluationid);
            const reportPDF = await this.$http.getReportPDF(reportid.reportid);
            pdfMake.createPdf(reportPDF).open();
        }
    },
    async created() {
        this.evaluationid = this.$route.params.evaluationid;
        this.evaluationsheet = await this.$http.getEvaluationSheetById(this.evaluationid);
        console.log(this.evaluationsheet);
        this.student = this.evaluationsheet.student;
        this.module = await this.evaluationsheet.module;
        this.discipline = await this.evaluationsheet.discipline;
        this.evaluationsPerAssignment = this.evaluationsheet.scores.reduce((acc, evaluation, index) => {
            if (acc.get(evaluation.name)) {
                acc.get(evaluation.name).push(evaluation);
            } else {
                acc.set(evaluation.name, [evaluation]);
            }
            return acc;
        }, new Map());
        console.log(this.evaluationsPerAssignment);
    },
    computed: {
        ...mapGetters(["currentUser"]),
        isEditable() {
            return !this.evaluationsheet.enddate;
        }
    }

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
