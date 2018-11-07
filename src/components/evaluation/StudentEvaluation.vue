<template>
<v-container>
    <v-layout align-center>
        <img class="" src="../../assets/Logos_CLW_KTA_ZWAAN.png" height="100%" >
        <v-spacer></v-spacer>
        <h1>Evaluatiefiche opleiding {{discipline.name}}</h1>
    </v-layout>
    <table id="headerTable" cellspacing="0">
        <tr>
            <td>Naam: <strong>{{student.lastname}}</strong></td>
            <td>Schooljaar: <strong>{{createSchoolyear()}}</strong></td>
            <!-- <td class='togetherTop'>Opdrachten =></td> -->
        </tr>
        <tr>
            <td>Voornaam: <strong>{{student.firstname}}</strong></td>
            <td>Leerkracht: <strong>{{"joske"}}</strong></td>
            <!-- <td class="togetherBottom"></td> -->
        </tr>
    </table>
    <v-text-field v-model="assignmentName" label="Naam van de opdracht" required :rules="nameRules"></v-text-field>
    <v-layout row>
        <modulelist :module="module"></modulelist>
    </v-layout>
</v-container>
</template>

<script>
import moment from "moment";
import {name as nameRules} from "../../constants/rules";

export default {
    name: "StudentEvaluation",
    data() {
        return {
            student: {},
            module: {},
            discipline: {},
            assignmentName: "",
            nameRules: nameRules
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
