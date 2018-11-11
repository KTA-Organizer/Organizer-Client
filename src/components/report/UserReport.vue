<template>
<v-container v-if="report.creation">
  <v-layout align-center>
    <img class="" src="../../assets/Logos_CLW_KTA_ZWAAN.png" height="100%" >
    <v-spacer></v-spacer>
    <h1>Rapport module {{report.module.name}}</h1>
  </v-layout>
  <v-layout row class="mb-4">
    <table id="headerTable" cellspacing="0">
      <th>Info</th>
      <tr>
        <td>Naam: <strong>{{report.student.lastname}}</strong></td>
        <td>Periode: <strong>{{termStart}}</strong> - <strong>{{termEnd}}</strong></td>
      </tr>
      <tr>
        <td>Voornaam: <strong>{{report.student.firstname}}</strong></td>
        <td>Leerkracht: <strong>{{report.teacher.firstname}} {{report.teacher.firstname}}</strong></td>
      </tr>
    </table>
    <v-spacer></v-spacer>
  </v-layout>
  <v-card>
    <v-card-title>
      <v-layout column align-start>
        <h3>Algemene Commentaar</h3>
        <p>Commentaar van toepassing op deze module</p>
      </v-layout>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-textarea placeholder="bv. Goed gewerkt" v-model="generalComment"></v-textarea>
      </v-form>
    </v-card-text>
  </v-card>
  <table-report :report="report"></table-report>
</v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';

function formatDate(str) {
  if (!str) {
    return;
  }
  return moment(str).format('DD/MM/YYYY')
}

export default {
  name: "UserReport",
  data: () => ({
    generalComment: "",
    report: {},
  }),
  computed: {
    ...mapGetters(["currentUser"]),
    termStart() {
      return formatDate(this.report.termStart)
    },
    termEnd() {
      return formatDate(this.report.termEnd)
    },
  },
  methods: {
    async fetchData() {
      const id = this.$route.params.reportid;
      this.report = await this.$http.getReport(id);
    }
  },
  async created() {
    await this.fetchData();
  }
}
</script>

<style lang="css" scoped>
#headerTable {
    margin-top: 1em;
}

#headerTable td {
    border: 1px black solid;
    box-sizing: border-box !important;
    margin: 0;
    padding: 1em;
    text-align: left;
}
</style>
