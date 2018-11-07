<template>
<v-container>
    <h1>
        <v-icon>build</v-icon> Under construction <v-icon>build</v-icon>
    </h1>

    <h1>Evaluatie maken</h1>
    <v-form ref="form" lazy-validation>
        <v-select label="Opleiding" v-model="discipline" :items="disciplineNames" v-on:input="filterStudents">

        </v-select>
        <v-select label="Module" v-model="module" :items="moduleNames"></v-select>
        <v-select label="Student" v-model="student" :items="filteredStudentNames">

        </v-select>
    </v-form>

</v-container>
</template>

<script>
export default {
    name: "Evaluation",
    data() {
        return {
            module: undefined,
            discipline: "Opleiding",
            disciplines: [],
            disciplineNames: [],
            module: "",
            modules: [],
            moduleNames: [],
            student: "Student",
            students: [],
            studentNames: [],
            filteredStudentNames: []
        };
    },
    methods: {
        filterStudents() {
            const selectedDiscipline = this.disciplines.find(
                x => x.name === this.discipline
            );
            console.log(selectedDiscipline);
            console.log(this.students);
            this.filteredStudentNames = this.students
                .filter(x => {
                    console.log(x.discipline.id === selectedDiscipline.id)
                    return x.discipline.id === selectedDiscipline.id;
                })
                .map(x => `${x.firstname} ${x.lastname}`);
        }
    },
    async created() {
        const students = await this.$http.getStudents();
        this.students = students.items.filter(x => x.roles.indexOf("STUDENT") > -1);
        this.students.map(async x => {
            x.discipline = await this.$http.getOpleidingForStudent(x.id);
        });
        this.studentNames = this.students.map(x => `${x.firstname} ${x.lastname}`);
        this.filteredStudentNames = this.studentNames;

        const disciplines = await this.$http.getOpleidingen();
        this.disciplines = disciplines;
        this.disciplineNames = this.disciplines.map(x => x.name);

        const modules = await this.$http.get
    }
};
</script>
