<template>
<v-layout column class="mb-4">
  <v-layout justify-space-between xs12 row wrap>
    <v-flex xs12 md4>
      <img class="" src="../../assets/Logos_CLW_KTA_ZWAAN.png">
  </v-flex>
      <v-flex xs12 md8 fill-height>
        <slot></slot>
      </v-flex>
  </v-layout>
  <v-layout justify-space-between xs12 row wrap>
    <v-flex xs12 md4>
      <table id="headerTable" cellspacing="0">
        <th class="text-sm-left">Info</th>
        <tr>
          <td>Naam: <strong>{{evaluationSheet.student.lastname}}</strong></td>
          <td>Periode: <strong>{{evaluationSheet.periodname}}</strong></td>
        </tr>
        <tr>
          <td>Voornaam: <strong>{{evaluationSheet.student.firstname}}</strong></td>
          <td>Leerkracht: <strong>{{evaluationSheet.teacher.firstname}} {{evaluationSheet.teacher.lastname}}</strong></td>
        </tr>
      </table>
    </v-flex>
    <v-flex xs12 offset-md2 md6>
      <table id="headerTable" cellspacing="0">
        <th class="text-sm-left">Legende</th>
        <tr>
          <td v-for="key in Object.keys(gradeKeys)" v-bind:key="key">{{gradeKeys[key]}}</td>
        </tr>
        <tr>
          <td v-for="key in Object.keys(gradeKeys)" v-bind:key="key">{{key}}</td>
        </tr>
      </table>
    </v-flex>
  </v-layout>
</v-layout>
</template>

<script>
import moment from 'moment';

import {
  gradeKeys
} from "../../constants/grades";

function formatDate(str) {
  if (!str) {
    return;
  }
  return moment(str).format('DD/MM/YYYY')
}

export default {
  name: "EvaluationHeader",
  props: ["evaluationSheet"],
  data() {
    return {
      gradeKeys: gradeKeys,
    }
  },
  computed: {
    termStart() {
      return formatDate(this.evaluationSheet.startdate);
    },
    termEnd() {

      return this.evaluationSheet.enddate ? formatDate(this.evaluationSheet.enddate) : "Nog te bepalen";
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
