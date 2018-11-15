<template>
<v-container>
    <h1>Evaluatie maken</h1>
    <v-form ref="form" lazy-validation>
        <v-select label="Opleiding" v-model="discipline" :items="disciplineNames" v-on:input="filterStudents" :rules="defaultRule" required></v-select>
        <v-select label="Module" v-model="module" :items="moduleNames" :disabled="!disciplineChosen" :rules="defaultRule" required></v-select>
        <v-select v-on:input="fetchEvaluations" v-if="forUser" label="Student" v-model="student" :items="filteredStudentNames" :disabled="!disciplineChosen" :rules="defaultRule" required></v-select>
        <v-btn @click="newEvaluationDialog" color="primary">Maak nieuwe evaluatie</v-btn>
    </v-form>
    <v-layout v-if="student">
        <v-flex v-for="evaluation in evaluations" v-bind:key="evaluation.id">
            <v-card>
                <v-card-title>
                    <h2>Student: {{student}}</h2>
                </v-card-title>
                <v-card-text>
                    <p class="text-xs-left">Startdatum: {{formatDate(evaluation.startdate)}}</p>
                    <p class="text-xs-left">Einddatum: {{formatDate(evaluation.enddate)}}</p>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" @click="updateEvaluation(evaluation.id)">
                        <v-icon>edit</v-icon>Vul aan
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>

    <v-dialog width="500" v-model="newEvaluation">
        <v-card>
            <v-card-title>
                <h1>Nieuwe evaluatie</h1>
            </v-card-title>
            <v-card-text>
                <h2>Kies de startdatum:</h2>
                <v-date-picker v-model="newEvaluationDate" :landscape="true" :reactive="true">
                </v-date-picker>
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" @click="createNewEvaluation">Maak aan</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</v-container>
</template>

<script>
import {
    defaultRule
} from "../../constants/rules";
import moment from "moment";

export default {
    name: "EvaluationForm",
    data() {
        return {
            module: undefined,
            discipline: undefined,
            disciplines: [],
            disciplineNames: [],
            module: undefined,
            modules: [],
            moduleNames: [],
            student: undefined,
            students: [],
            studentNames: [],
            filteredStudentNames: [],
            disciplineChosen: false,
            defaultRule: defaultRule,
            forUser: true,
            newEvaluation: false,
            newEvaluationDate: new Date().toISOString().substr(0, 10),
            evaluations: [],
        };
    },
    methods: {
        formatDate(date) {
            if (!date) {
                return "Nog te bepalen";
            }
            return moment(date).format('LL');
        },
        async filterStudents() {
            const selectedDiscipline = this.disciplines.find(
                x => x.name === this.discipline
            );
            this.filteredStudentNames = this.students
                .filter(x => {
                    return x.discipline.id === selectedDiscipline.id;
                })
                .map(x => `${x.firstname} ${x.lastname}`);
            const modules = await this.$http.getModulesForDiscipline(selectedDiscipline.id);
            this.modules = modules;
            this.moduleNames = this.modules.map(x => x.name);
            this.disciplineChosen = true;
        },
        updateEvaluation(evaluationid) {
            // const selectedModule = this.modules.find(x => x.name === this.module);
            // const selectedStudent = this.students.find(
            //     x => `${x.firstname} ${x.lastname}` === this.student
            // );
            // if (this.$refs.form.validate()) {
            //     let route = `/${this.$route.name}`;
            //     if (this.forUser) {
            //         route += `/${selectedStudent.id}`;
            //     }
            //     route += `/${selectedModule.id}`
            //     console.log("route: ", route)
            //     this.$router.push(route);
            // }
            if (this.$refs.form.validate()) {
                this.$router.push(`/Evaluatie/${evaluationid}`);
            }
        },
        newEvaluationDialog() {
            if (this.$refs.form.validate()) {
                this.newEvaluation = true;
            }
        },
        async createNewEvaluation() {
            console.log("Hello new eval");
            console.log(new Date(this.newEvaluationDate));
        },
        async fetchEvaluations() {
            const selectedStudent = this.students.find(
                x => `${x.firstname} ${x.lastname}` === this.student
            );
            const selectedModule = this.modules.find(x => x.name === this.module);
            console.log(selectedStudent.id, selectedModule.id);
            this.evaluations = await this.$http.getEvaluationSheetsForStudentInModule(selectedStudent.id, selectedModule.id);
            console.log(this.evaluations);
        }
    },
    async created() {
        const students = await this.$http.getStudents();
        this.students = students.items;
        this.students.map(async x => {
            x.discipline = await this.$http.getOpleidingForStudent(x.id);
        });
        this.studentNames = this.students.map(x => `${x.firstname} ${x.lastname}`);
        this.filteredStudentNames = this.studentNames;

        const disciplines = await this.$http.getOpleidingen();
        this.disciplines = disciplines;
        this.disciplineNames = this.disciplines.map(x => x.name);
    },
    computed: {

    }
};
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
</script>
