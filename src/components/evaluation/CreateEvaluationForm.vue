<template>
<v-container>
    
    <h1>Evaluatie maken</h1>
    <v-form ref="form" lazy-validation>
        <v-select label="Opleiding" v-model="discipline" :items="disciplineNames" v-on:input="filterStudents" :rules="defaultRule" required></v-select>
        <v-select label="Module" v-model="module" :items="moduleNames" :disabled="!disciplineChosen" :rules="defaultRule" required></v-select>
        <v-select label="Student" v-model="student" :items="filteredStudentNames" :disabled="!disciplineChosen" :rules="defaultRule" required></v-select>
        <v-btn @click="createEvaluation" color="primary">Maak evaluatie aan</v-btn>
    </v-form>

</v-container>
</template>

<script>
import {defaultRule} from "../../constants/rules";

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
            defaultRule: defaultRule
        };
    },
    methods: {
        async filterStudents() {
            const selectedDiscipline = this.disciplines.find(
                x => x.name === this.discipline
            );
            this.filteredStudentNames = this.students
                .filter(x => {
                    return x.discipline.id === selectedDiscipline.id;
                })
                .map(x => `${x.firstname} ${x.lastname}`);
            const modules = await this.$http.getFullOpleiding(selectedDiscipline.id);
            this.modules = modules;
            this.moduleNames = this.modules.map(x => x.name);
            this.disciplineChosen = true;
        },
        createEvaluation() {
            const selectedModule = this.modules.find(x => x.name === this.module);
            const selectedStudent = this.students.find(
                x => `${x.firstname} ${x.lastname}` === this.student
            );
            if (this.$refs.form.validate()) {
                this.$router.push(`/Evaluatie/${selectedStudent.id}/${selectedModule.id}`);
            }
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
    }
};
</script>
