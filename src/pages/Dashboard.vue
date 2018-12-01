<template>
<v-layout row>
  <v-flex column xs12 md6>
    <v-card>
      <v-card-text>
        <h1>Welkom {{currentUser.firstname}}</h1>
        <p>Cras condimentum aliquam nibh, quis tincidunt felis feugiat at. Cras eget luctus est. Praesent bibendum enim ipsum, ac laoreet justo fringilla vitae. Mauris dignissim nulla turpis, a cursus metus rhoncus finibus. Donec eleifend feugiat ante, id pellentesque odio maximus ac. Donec sodales vulputate sapien, non tristique ligula mattis nec. Maecenas rutrum, felis ac venenatis efficitur, nulla ante hendrerit felis, ut ultrices lectus ipsum in eros. Curabitur eleifend tincidunt arcu quis congue. Etiam nisl mi, interdum a luctus nec, ornare non massa.</p>
      </v-card-text>
    </v-card>
  </v-flex>
  <v-flex column xs12 md6 v-if="!isStudent">
    <v-card>
      <v-layout reverse row>
        <v-btn v-if="isAdmin" to="/melding/toevoegen" dark hover color="primary">
          <v-icon>add</v-icon>
          melding maken
        </v-btn>
      </v-layout>
      <v-flex>
        <notification v-on:delete="deleteMelding" :meldingen="meldingen" :currentUserId="currentUser.id"></notification>
      </v-flex>
    </v-card>
  </v-flex>
  <v-flex xs12 md6 v-else>
    <v-layout row wrap>
      <v-card v-for="report in studentReports" :key="report.id">
        <v-card-title>
          <h3>Module: {{report.module.name}}</h3>
        </v-card-title>
        <v-card-text style="text-align: left">
          <p>Opleiding: {{report.discipline.name}}</p>
          <p>Datum: {{report.creation}}</p>
          <p>Leerkracht: {{report.teacher.firstname + " " + report.teacher.lastname}}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn :to="'/rapport/'+report.id" dark hover color="primary">
            bekijken
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-layout>
  </v-flex>

</v-layout>
</template>

<script>
import moment from "moment";
import {
  mapGetters
} from 'vuex';

export default {
  name: "dashboard",
  data() {
    return {
      studentReports: [],
      meldingen: [],
    };
  },
  computed: mapGetters(["currentUser", "isTeacher", "isAdmin", "isStudent"]),
  async created() {
    if (this.isStudent) {
      const result = await this.$http.paginateReports(1, 1e9, { studentid: this.currentUser.id });
      this.studentReports = result.items.map(report => Object.assign(report, {
        creation: moment(report.creation).format("DD-MM-YYYY")
      }))
    } else {
      const meldingen = await this.$http.getMeldingen();
      this.meldingen = meldingen.map(m => Object.assign(m, {
        datum: moment(m.datum).fromNow()
      }))
    }
  },
  methods: {
    async deleteMelding(id) {
      await this.$http.removeMelding(id);
      this.meldingen = this.meldingen.filter(m => m.id !== id);
    }
  }
};
</script>
