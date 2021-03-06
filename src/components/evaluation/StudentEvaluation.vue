<template>
<v-container v-if="loaded">
    <evaluation-header :evaluationSheet="evaluationsheet">
        <h1>Evaluatiefiche Module: {{module.name}}</h1>
        <h2>Opleiding: {{discipline.name}}</h2>
        <v-btn v-if="!reportid" class="success" v-on:click="showGenerateReport = true;">
            <v-icon>assignment</v-icon>&nbsp; Rapport genereren
        </v-btn>
        <router-link v-if="reportid" to="/Rapport/5723348596162560">
            <v-btn class="success">
                <v-icon>assignment</v-icon>&nbsp; Rapport bekijken
            </v-btn>
        </router-link>
        <v-btn v-if="!evaluationsheet.enddate" color="error" @click="showEndEvaluation = true; evaluationToEnd = evaluationsheet.id;">
            <v-icon>clear</v-icon>&nbsp; afsluiten
        </v-btn>
    </evaluation-header>

    <v-card class="mb-4" v-if="isEditable">
        <v-card-title>
            <h2>Nieuwe opdracht toevoegen</h2>
        </v-card-title>
        <v-card-text>
            <v-form class="mt-3" ref="form" lazy-validation>
                <v-text-field v-model="assignmentName" label="Naam van de opdracht" required :rules="nameRules"></v-text-field>
            </v-form>
            <p>Voeg de punten per criteria hieronder in.</p>
        </v-card-text>
        <v-card-actions>
            <v-btn v-if="isEditable" color="primary" @click="saveEvaluation">
                <v-icon>save</v-icon>&nbsp; Opslaan
            </v-btn>
        </v-card-actions>
    </v-card>

    <modulelist :evaluationId="evaluationsheet.id" :module="module" :evaluating="isEditable" :evaluations="evaluationsPerAssignment" :newEvaluation="newEvaluation" v-on:graded="graded"></modulelist>
    <confirmdialog v-bind:model.sync="showEndEvaluation" v-on:confirm="endEvaluation" :name="'deze evaluatie'" :action="'beëindigen (permanent)'"></confirmdialog>
    <confirmdialog v-bind:model.sync="showGenerateReport" v-on:confirm="createReport" :name="'deze evaluatie'" :action="'beëindigen (permanent (indien dit nog niet het geval is)) en het rapport te genereren'"></confirmdialog>
</v-container>
</template>

<script>
import {
    mapGetters
} from 'vuex';
import EvaluationHeader from "../evaluation/EvaluationHeader.vue"

import {
    name as nameRules
} from "../../constants/rules";
import {
    gradeKeys
} from "../../constants/grades";

export default {
    name: "StudentEvaluation",
    components: {
        EvaluationHeader
    },
    data() {
        return {
            assignmentName: "",
            nameRules: nameRules,
            evaluationsPerAssignment: new Map(),
            gradeKeys: gradeKeys,
            newEvaluation: {},
            evaluationsheet: {},
            loaded: false,
            showEndEvaluation: false,
            evaluationToEnd: undefined,
            showGenerateReport: false,
        };
    },
    methods: {
        graded() {},
        async endEvaluation(id) {
            await this.$http.endEvaluation(this.evaluationToEnd);
            this.evaluationToEnd = undefined;
            this.showEndEvaluation = false;
            this.fetchData();
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
            const newScores = this.evaluationsheet.scores.concat([]);
            for (const criteriaid in this.newEvaluation) {
                const grade = this.newEvaluation[criteriaid];
                newScores.push({
                    name: this.assignmentName,
                    grade,
                    criteriaid: +criteriaid,
                });
            }
            await this.$http.saveEvaluation(this.evaluationsheet.id, newScores);
            this.newEvaluation = {};
            this.assignmentName = "";
            await this.fetchData();
        },
        async fetchData() {
            this.loaded = false;
            const evaluationid = this.$route.params.evaluationid;
            const [evaluationsheet, reportid] = await Promise.all([
                this.$http.getEvaluationSheetById(evaluationid),
                this.$http.getReportByEvaluationid(evaluationid)
            ]);
            this.evaluationsheet = evaluationsheet;
            this.reportid = reportid.reportid ? reportid.reportid : undefined;
            this.evaluationsPerAssignment = this.evaluationsheet.scores.reduce((acc, evaluation, index) => {
                if (acc.get(evaluation.name)) {
                    acc.get(evaluation.name).push(evaluation);
                } else {
                    acc.set(evaluation.name, [evaluation]);
                }
                return acc;
            }, new Map());
            this.loaded = true;
        },
        async createReport() {
            const {
                reportid
            } = await this.$http.createReport(this.evaluationsheet.id);
            this.$router.push(`/rapport/${reportid}`);
        }
    },
    async created() {
        await this.fetchData();
    },
    computed: {
        ...mapGetters(["currentUser"]),
        student() {
            return this.evaluationsheet.student;
        },
        module() {
            return this.evaluationsheet.module;
        },
        discipline() {
            return this.evaluationsheet.discipline;
        },
        isEditable() {
            return !this.evaluationsheet.enddate;
        }
    }

};
</script>

<style scoped>
a {
    text-decoration: none;
    }
</style>
