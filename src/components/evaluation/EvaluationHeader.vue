<template>
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
      <slot></slot>
    </v-layout>
  </v-flex>
</v-layout>
</template>

<script>
import moment from 'moment';

function formatDate(str) {
  if (!str) {
    return;
  }
  return moment(str).format('DD/MM/YYYY')
}

export default {
  name: "EvaluationHeader",
  props: ["evaluationSheet"],
  computed: {
    termStart() {
      return formatDate(this.evaluationSheet.startdate);
    },
    termEnd() {
      return formatDate(this.evaluationSheet.enddate);
    },
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