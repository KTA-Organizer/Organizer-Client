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
  <v-card>
        <v-card-text>
        <v-layout row >
            <v-flex xs12 sm6 md3>
                <v-layout mr-2>
                    <v-text-field clearable @click:clear="clearNameFilter" autofocus="autofocus" type="text" placeholder="Filter op naam" v-model="nameFilter" v-on:input="applyFilters()"></v-text-field>
                </v-layout>
            </v-flex>
            <v-flex xs12 sm6 md3>
                <v-layout mr-2>
                    <v-text-field clearable @click:clear="clearTeacherFilter" autofocus="autofocus" type="text" placeholder="Filter op leerkracht" v-model="teacherFilter" v-on:input="applyFilters()"></v-text-field>
                </v-layout>
            </v-flex>
            <v-flex xs12 sm6 md3>
                <v-layout mr-2>
                    <v-text-field clearable @click:clear="clearDisciplineFilter" autofocus="autofocus" type="text" placeholder="Filter op opleiding" v-model="disciplineFilter" v-on:input="applyFilters()"></v-text-field>
                </v-layout>
            </v-flex>
            <v-flex xs12 sm6 md3>
                <v-layout mr-2>
                    <v-text-field clearable @click:clear="clearModuleFilter" autofocus="autofocus" type="text" placeholder="Filter op module" v-model="moduleFilter" v-on:input="applyFilters()"></v-text-field>
                </v-layout>
            </v-flex>
        </v-layout>
        </v-card-text>
    </v-card>
  <v-layout row-wrap>
    <v-flex class="mt-3">
      <v-data-table disable-initial-sort v-bind:headers="headers" :items="filteredReports" :pagination.sync="pagination" :total-items="totalReports" :loading="loading" class="elevation-1">
        <template slot="items" slot-scope="props">
          <tr>
            <td class="text-xs-left">{{ props.item.student.firstname + " " + props.item.student.lastname }}</td>
            <td class="text-xs-left">{{ props.item.teacher.firstname + " " + props.item.teacher.lastname }}</td>
            <td class="text-xs-left">{{ props.item.discipline.name }}</td>
            <td class="text-xs-left">{{ props.item.module.name }}</td>
            <td class="text-xs-left">{{ props.item.open ? "Open" : "Gesloten" }}</td>
            <td class="text-xs-right">
              <v-btn round color="green" class="ma-1" dark v-on:click="openPDF(props.item.id)">
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
import pdfMake from "pdfmake/build/pdfmake.min.js";

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
      filteredReports: [],
      totalReports: 0,
      loading: true,
      pagination: {},
      nameFilter: "",
      teacherFilter: "",
      disciplineFilter: "",
      moduleFilter: "",
      statusFilter: ""
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
    applyFilters() {

            const naamFiltertje = this.nameFilter ? this.nameFilter.toLowerCase() : false;
            const teacherFiltertje = this.teacherFilter ? this.teacherFilter.toLowerCase() : false;
            const moduleFiltertje = this.moduleFilter ? this.moduleFilter.toLowerCase() : false;
            const disciplineFiltertje = this.disciplineFilter ? this.disciplineFilter.toLowerCase() : false;
            this.filteredReports = this.reports;

            if (moduleFiltertje) {
                this.filteredReports = this.filteredReports.filter(
                    x => x.module.name.toLowerCase().includes(moduleFiltertje)
                );
            }
            
            if (disciplineFiltertje) {
                this.filteredReports = this.filteredReports.filter(
                    x => x.discipline.name.toLowerCase().includes(disciplineFiltertje)
                );
            }
            if (teacherFiltertje) {
                this.filteredReports = this.filteredReports.filter(x =>
                    `${x.teacher.firstname} ${x.teacher.lastname}`.toLowerCase().includes(teacherFiltertje)
                );
            }
            if (naamFiltertje) {
                this.filteredReports = this.filteredReports.filter(x =>
                    `${x.student.firstname} ${x.student.lastname}`.toLowerCase().includes(naamFiltertje)
                );
            }
        },
    async paginateReports() {
      this.loading = true;
      const { sortBy, descending, page, rowsPerPage } = this.pagination;
      const result = await this.$http.paginateReports(page, rowsPerPage, {});
      this.reports = result.items;
      this.filteredReports = this.reports;
      this.totalReports = result.total;
      this.loading = false;
    },
    async openPDF(reportid) {
      const pdfData = await this.$http.getReportPDF(reportid);
      pdfMake
        .createPdf(pdfData)
        .print();
    },
      clearNameFilter() {
          this.nameFilter = "";
          this.applyFilters();
      },
      clearTeacherFilter() {
          this.teacherFilter = "";
          this.applyFilters();
      },
      clearDisciplineFilter() {
          this.disciplineFilter = "";
          this.applyFilters();
      },
      clearModuleFilter() {
          this.moduleFilter = "";
          this.applyFilters();
      }
  },
  async created() {}
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
div.menu__content--autocomplete {
  top: 165px !important;
}
</style>
