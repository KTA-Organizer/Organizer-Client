<template>
<v-container v-if="loaded">
    <evaluation-header :evaluationSheet="evaluationSheet">
        <h1>Rapport module: {{evaluationSheet.module.name}}</h1>
        <h2>Opleiding: {{evaluationSheet.discipline.name}}</h2>

        <div v-if="!isStudent">
            <v-btn class="primary" v-if="!editMode" v-on:click="editComments">
                <v-icon>edit</v-icon>&nbsp; Opmerkingen Aanpassen
            </v-btn>
            <v-btn class="primary" v-if="editMode" v-on:click="cancelEdit">
                <v-icon>cancel</v-icon>&nbsp; Aanpassingen annuleren
            </v-btn>
            <v-btn class="primary" v-if="editMode" v-on:click="saveComments">
                <v-icon>save</v-icon>&nbsp; Opmerkingen Opslaan
            </v-btn>
            <v-btn class="success" :disabled="!!report.open" v-on:click="openReport">
                <v-icon>face</v-icon>&nbsp; Openstellen voor student
            </v-btn>
        </div>
        <v-flex>
            <v-btn class="secondary" v-on:click="printPDF">
                <v-icon>print</v-icon>&nbsp; Rapport afprinten
            </v-btn>
            <v-btn class="secondary" v-on:click="savePDF">
                <v-icon>cloud_download</v-icon>&nbsp; Rapport downloaden
            </v-btn>
        </v-flex>
    </evaluation-header>
    <v-card>
        <v-card-title>
            <v-layout column align-start>
                <h3>Algemene Commentaar</h3>
                <p>Commentaar van toepassing op deze module</p>
            </v-layout>
        </v-card-title>
        <v-card-text>
            <v-form>
                <v-textarea placeholder="Nog geen commentaar gegeven." :readonly="!editMode" v-model="generalComment"></v-textarea>
            </v-form>
        </v-card-text>
    </v-card>
    <table-report :report="report" :goalComments="goalCommentsMap" :readonly="!editMode"></table-report>
</v-container>
</template>

<script>
import {
    mapGetters
} from "vuex";
import EvaluationHeader from "../evaluation/EvaluationHeader.vue";
import moment from "moment";

export default {
    name: "UserReport",
    components: {
        EvaluationHeader
    },
    data: () => ({
        generalComment: "",
        goalCommentsMap: {},
        report: {},
        loaded: false,
        editMode: false,
        reportid: -1
    }),
    computed: {
        ...mapGetters(["currentUser", "isStudent"]),
        evaluationSheet() {
            return this.report.evaluationSheet;
        }
    },
    methods: {
        async fetchData() {
            const id = this.$route.params.reportid;
            this.reportid = id;
            this.report = await this.$http.getReport(id);
            this.generalComment = this.report.generalComment;
            this.goalCommentsMap = this.report.goalComments.reduce((agg, val) => {
                return Object.assign(agg, {
                    [val.goalid]: val.comment
                });
            }, {});
            this.loaded = true;
        },
        editComments() {
            this.editMode = true;
        },
        async cancelEdit() {
            this.editMode = false;
            await this.fetchData();
        },
        async saveComments() {
            this.editMode = false;
            const id = this.$route.params.reportid;
            const {
                goalCommentsMap,
                generalComment
            } = this;
            const goalComments = Object.keys(goalCommentsMap).map(goalid => ({
                goalid,
                comment: goalCommentsMap[goalid]
            }));
            await this.$http.saveReportComments(id, {
                generalComment,
                goalComments
            });
        },
        async printPDF() {
            const pdfData = await this.$http.getReportPDF(this.reportid);
            const filename = this.getPdfName();
            this.$pdf.print(pdfData, filename);
        },
        async savePDF() {
            const pdfData = await this.$http.getReportPDF(this.reportid);
            const filename = this.getPdfName();
            this.$pdf.download(pdfData, filename);
        },
        async openReport() {
            this.report.open = true;
            await this.$http.openReport(this.reportid);
        },
        getPdfName() {
            return `${this.report.evaluationSheet.student.firstname} ${this.report.evaluationSheet.student.lastname} ${moment().format("DD-MM-YYYY HH-mm")}`.split(" ").join("_");
        }
    },
    async created() {
        await this.fetchData();
    }
};
</script>
