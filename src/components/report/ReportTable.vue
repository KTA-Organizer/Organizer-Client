<template>
<v-layout column>
  <!-- <h1 class="categorieTitle mb-4 text-xs-left">{{discipline}}</h1> -->
  <v-flex class="mt-5" v-for="(domain) in report.module.domains" :value="domain.active" v-bind:key="domain.id">
    <h3 class="text-xs-left mb-2">Domein: {{domain.name}}</h3>
    <v-data-table no-data-text="Geen doelstellingen beschikbaar" :headers="headers" hide-actions :items="domain.goals" class="elevation-1 mb-5">
      <template slot="headers" slot-scope="props">
        <tr class="headers">
          <th v-for="header in props.headers" :key="header.text">
            <div>{{ header.text }}</div>
          </th>
        </tr>
      </template>
      <template slot="items" slot-scope="props">
        <tr>
          <td>{{ props.item.name }}</td>
          <td>{{getScore(props.item.id, "G")}}</td>
          <td>{{getScore(props.item.id, "V")}}</td>
          <td>{{getScore(props.item.id, "OV")}}</td>
          <td>{{getScore(props.item.id, "RO")}}</td>
          <td>
            <v-textarea placeholder="Geen commentaar" :readonly="readonly" v-model="goalComments[props.item.id]"></v-textarea>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-flex>
</v-layout>
</template>

<script>
import * as grades from "../../constants/grades";

export default {
  name: "ReportTable",
  props: ["report", "goalComments", "readonly"],
  data() {
    return {
      headers: [{
          text: "Doelstelling",
          sortable: false
        },
        {
          text: "G",
          sortable: false,
        },
        {
          text: "V",
          sortable: false,
        },
        {
          text: "OV",
          sortable: false,
        },
        {
          text: "RO",
          sortable: false,
        },
        {
          text: "Opmerkingen",
          sortable: false
        }
      ]
    }
  },
  computed: {
    goalScores() {
      return this.report.goalAggregateScores.reduce((agg, val) => ({
        ...agg,
        [val.goalid]: val.grade
      }), {})
    },
  },
  methods: {
    getScore(goalid, key) {
      const grade = this.goalScores[goalid];
      if (!grade) return "NVT";
      const result = grade ? this.getScoreKey(grade) : "NVT";
      return result === key ? "X" : "";
    },
    getScoreKey(score) {
      const scoreToFind = Math.round(score);
      return grades.gradeKeys[this.getKeyByValue(grades.gradeValues, scoreToFind)];
    },
    getKeyByValue(object, value) {
      return Object.keys(object).find(key => object[key] === value);
    },
  },
}
</script>

<style scoped>
</style>
