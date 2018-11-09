<template>
    <v-container>
        <table-report :report="report" :module="module" :discipline="discipline"></table-report>
    </v-container>
</template>

<script>
export default {
    name: "UserReport",
    data() {
        return {
            student: {},
            module: {},
            report: [],
            discipline: {}
        }
    },
    methods: {

    },
    async created() {
        const studentId = this.$route.params.studentId;
        const moduleId = this.$route.params.moduleId;
        this.student = await this.$http.getUser(studentId);
        this.module = await this.$http.getModule(moduleId);
        this.report = await this.$http.getReportForStudentForModule(studentId, moduleId);
        this.discipline = this.$route.params.disciplinename;
        console.log(this.report);
    }
}
</script>
