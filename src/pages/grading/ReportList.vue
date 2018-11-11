<template>
<div>
  <v-layout row-wrap>
    <v-flex xs4 offset-xs1>
    </v-flex>
    <v-flex xs1 offset-xs4 class="mr-5">
      <router-link :to="{ name: 'Rapport Aanmaken' }">
        <v-btn class="primary">
          <v-icon>add</v-icon> Rapport Aanmaken
        </v-btn>
      </router-link>
    </v-flex>
  </v-layout>
  <v-layout row-wrap>
    <v-flex class="mt-5">
      <v-data-table v-bind:headers="headers" :items="reports" hide-actions class="elevation-1">
        <template slot="items" slot-scope="props">
          <tr>
            <td class="text-xs-left">{{ props.item.student.firstname + " " + props.item.student.lastname }}</td>
            <td class="text-xs-left">{{ props.item.teacher.firstname + " " + props.item.teacher.lastname }}</td>
            <td class="text-xs-left">{{ props.item.discipline.name }}</td>
            <td class="text-xs-left">{{ props.item.module.name }}</td>
            <td class="text-xs-right">
              <v-btn color="primary" class="ma-1 right" dark :to="{ name: 'Rapport', params: { reportid: props.item.id }}">
                <v-icon dark>remove_red_eye</v-icon> Bekijken
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
export default {
  name: "DisciplinesList",
  data() {
    return {
      headers: [{
          text: "Student",
          align: "left",
          value: "student"
        },
        {
          text: "Leerkracht",
          align: "left",
          value: "teacher"
        },
        {
          text: "Opleiding",
          align: "left",
          value: "discipline"
        },
        {
          text: "Module",
          align: "left",
          value: "module"
        },
        {
          text: "",
          value: "actionbtns"
        }
      ],
      reports: [],
    };
  },
  computed: mapGetters(["isAdmin"]),
  methods: {
    async getReports() {
      this.reports = await this.$http.getReports();
    }
  },
  async created() {
    await this.getReports();
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
div.menu__content--autocomplete {
  top: 165px !important;
}
</style>
