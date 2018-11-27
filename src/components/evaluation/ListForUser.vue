<template>
<v-layout wrap>
    <v-flex v-for="evaluation in evaluations" v-bind:key="evaluation.id">
        <v-card class="mt-2">
            <v-card-title>
                <h2>Evaluatie</h2>
            </v-card-title>
            <v-card-text>
                <v-layout>
                    <v-flex>
                        <p class="text-xs-left">Startdatum: {{formatDate(evaluation.startdate)}}</p>
                        <p class="text-xs-left">Einddatum: {{formatDate(evaluation.enddate)}}</p>
                    </v-flex>
                    <v-flex v-if="evaluation.teacher">
                        aangemaakt door: {{ evaluation.teacher.firstname }} {{ evaluation.teacher.lastname }}
                    </v-flex>
                </v-layout>
            </v-card-text>
        </v-card>
    </v-flex>
</v-layout>
</template>

<script>
import moment from "moment";

export default {
  name: "ListForUser",
  props: ["userid"],
  data() {
    return {
      evaluations: []
    };
  },
  methods: {
    formatDate(date) {
      if (!date) {
        return "Nog te bepalen";
      }
      return moment(date).format("LL");
    },
  },
  async created() {
    this.evaluations = await this.$http.getEvaluationSheetsForStudentInModule(
      this.userid
    );
    const teachers = [];
    this.evaluations.forEach(async (evaluation) => {
      if (teachers[evaluation.teacherid]) {
        evaluation.teacher = teachers[evaluation.teacherid];
      } else {
        const teacher = await this.$http.getUser(evaluation.teacherid);
        evaluation.teacher = teacher;
        teachers[teacher.id] = teacher;
      }
    });
  },
  computed: {}
};
</script>
