<template>
<v-container v-if="loaded">
  <v-layout class="mb-4" row>
    <v-flex xs12 md4>
      <img class="" src="../../assets/Logos_CLW_KTA_ZWAAN.png">
      <table id="headerTable" cellspacing="0">
        <th>Info</th>
        <tr>
          <td>Naam: <strong>{{evaluationSheet.student.lastname}}</strong></td>
          <td>Periode: <strong>{{termStart}}</strong> - <strong>{{termEnd}}</strong></td>
        </tr>
        <tr>
          <td>Voornaam: <strong>{{evaluationSheet.student.firstname}}</strong></td>
          <td>Leerkracht: <strong>{{evaluationSheet.teacher.firstname}} {{evaluationSheet.teacher.firstname}}</strong></td>
        </tr>
      </table>
    </v-flex>
    <v-flex xs12 md6 fill-height>
      <v-layout column align-content-space-between justify-space-between>
      <h1>Rapport module: {{evaluationSheet.module.name}}</h1>
      <h2>Opleiding: {{evaluationSheet.discipline.name}}</h2>
      <v-btn class="primary" v-if="!editMode" v-on:click="editComments">
        <v-icon>edit</v-icon> Opmerkingen Aanpassen
      </v-btn>
      <v-btn class="primary" v-if="editMode" v-on:click="cancelEdit">
        <v-icon>cancel</v-icon> Aanpassingen annuleren
      </v-btn>
      <v-btn class="primary" v-if="editMode" v-on:click="saveComments">
        <v-icon>save</v-icon> Opmerkingen Opslaan
      </v-btn>
      </v-layout>
    </v-flex>
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
} from 'vuex';
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
    goalCommentsMap: {},
    report: {},
    loaded: false,
    editMode: false
  }),
  computed: {
    ...mapGetters(["currentUser"]),
    evaluationSheet() {
      return this.report.evaluationSheet;
    },
    termStart() {
      return formatDate(this.evaluationSheet.startdate);
    },
    termEnd() {
      return formatDate(this.evaluationSheet.enddate);
    },
  },
  methods: {
    async fetchData() {
      const id = this.$route.params.reportid;
      this.report = await this.$http.getReport(id);
      this.generalComment = this.report.generalComment;
      this.goalCommentsMap = this.report.goalComments.reduce((agg, val) => {
        return Object.assign(agg, { [val.goalid]: val.comment })
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
      const {goalCommentsMap, generalComment } = this;
      const goalComments = Object.keys(goalCommentsMap)
        .map(goalid => ({ goalid, comment: goalCommentsMap[goalid] }))
      await this.$http.saveReportComments(id, { generalComment, goalComments });
    },
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
