<template>
<div>
    <v-layout row-wrap>
        <v-flex xs4 offset-xs1>
        </v-flex>
        <v-flex xs1 offset-xs4 class="mr-5">
            <!-- <router-link :to="{ name: 'Rapport Aanmaken' }">
        <v-btn class="primary">
          <v-icon>add</v-icon>&nbsp; Rapport Aanmaken
        </v-btn>
      </router-link> -->
        </v-flex>
    </v-layout>
    <v-layout row-wrap>
        <v-flex class="mt-3">
            <v-data-table disable-initial-sort v-bind:headers="headers" :items="reports" :pagination.sync="pagination" :total-items="totalReports" :loading="loading" class="elevation-1">
                <template slot="items" slot-scope="props">
                    <tr>
                        <td class="text-xs-left">{{ props.item.student.firstname + " " + props.item.student.lastname }}</td>
                        <td class="text-xs-left">{{ props.item.teacher.firstname + " " + props.item.teacher.lastname }}</td>
                        <td class="text-xs-left">{{ props.item.discipline.name }}</td>
                        <td class="text-xs-left">{{ props.item.module.name }}</td>
                        <td class="text-xs-left">{{ props.item.open ? "Open" : "Gesloten" }}</td>
                        <td class="text-xs-right">
                            <v-btn round color="green" class="ma-1" dark v-on:click="printPDF(props.item.id, props.item.student)">
                                <v-icon dark>print</v-icon>&nbsp; print
                            </v-btn>
                            <v-btn round color="primary" class="ma-1" dark :to="{ name: 'Rapport', params: { reportid: props.item.id }}">
                                <v-icon dark>remove_red_eye</v-icon>&nbsp; Bekijken
                            </v-btn>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</div>
</template>

<script>
import {
    mapGetters
} from 'vuex';
import moment from "moment";

export default {
    name: "DisciplinesList",
    data() {
        return {
            headers: [{
                    text: "Student",
                    align: "left",
                    value: "student",
                    sortable: false
                },
                {
                    text: "Leerkracht",
                    align: "left",
                    value: "teacher",
                    sortable: false
                },
                {
                    text: "Opleiding",
                    align: "left",
                    value: "discipline",
                    sortable: false
                },
                {
                    text: "Module",
                    align: "left",
                    value: "module",
                    sortable: false
                },
                {
                    text: "Status",
                    align: "left",
                    value: "open",
                    sortable: false
                },
                {
                    text: "",
                    value: "actionbtns",
                    sortable: false
                }
            ],
            reports: [],
            totalReports: 0,
            loading: true,
            pagination: {},
        };
    },
    watch: {
        pagination: {
            async handler() {
                await this.paginateReports();
            },
            deep: true
        }
    },
    async mounted() {
        await this.paginateReports();
    },
    computed: mapGetters(["isAdmin"]),
    methods: {
        async paginateReports() {
            this.loading = true;
            const {
                sortBy,
                descending,
                page,
                rowsPerPage
            } = this.pagination;
            const result = await this.$http.paginateReports(page, rowsPerPage, {});
            this.reports = result.items
            this.totalReports = result.total
            this.loading = false;
        },
        async printPDF(reportid, student) {
            const pdfData = await this.$http.getReportPDF(reportid);
            const filename = this.getPdfName(student);
            this.$pdf.print(pdfData, filename);
        },
        getPdfName(student) {
            return `${student.firstname} ${student.lastname} ${moment().format("DD-MM-YYYY HH-mm")}`.split(" ").join("_");
        }
    },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
div.menu__content--autocomplete {
    top: 165px !important;
}
</style>
