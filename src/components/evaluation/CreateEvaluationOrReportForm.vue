<template>
<v-container>
    <h1>{{$route.name.capitalize()}} maken</h1>
    <v-checkbox v-on:change="forUser = !forUser" v-if="isReportGenerator" color="primary" label="Genereer rapporten voor module"></v-checkbox>
    <v-form ref="form" lazy-validation>
        <v-select label="Opleiding" v-model="discipline" :items="disciplineNames" v-on:input="filterStudents" :rules="defaultRule" required></v-select>
        <v-select label="Module" v-model="module" :items="moduleNames" :disabled="!disciplineChosen" :rules="defaultRule" required></v-select>
        <v-select v-if="forUser" label="Student" v-model="student" :items="filteredStudentNames" :disabled="!disciplineChosen" :rules="defaultRule" required></v-select>
        <v-btn @click="createThing" color="primary">Genereer {{$route.name}}</v-btn>
    </v-form>
</v-container>
</template>

<script>
import {defaultRule} from "../../constants/rules";

export default {
    name: "EvaluationForm",
    props: ["isReportGenerator"],
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
        createThing() {
            const selectedModule = this.modules.find(x => x.name === this.module);
            const selectedStudent = this.students.find(
                x => `${x.firstname} ${x.lastname}` === this.student
            );
            if (this.$refs.form.validate()) {
                let route = `/${this.$route.name}/${this.discipline}`;
                if (this.forUser) {
                    route += `/${selectedStudent.id}`;
                }
                route += `/${selectedModule.id}`
                console.log("route: ", route)
                this.$router.push(route);
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
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
</script>
