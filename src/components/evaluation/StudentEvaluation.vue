<template>
<v-container v-if="loaded">
  <evaluation-header :evaluationSheet="evaluationsheet">
    <h1>Evaluatiefiche Module: {{module.name}}</h1>
    <h2>Opleiding: {{discipline.name}}</h2>
    <v-btn class="success" v-on:click="createReport">
      <v-icon>assignment</v-icon> Rapport genereren
    </v-btn>
  </evaluation-header>

  <v-card class="mb-4" v-if="isEditable">
    <v-card-title>
      <h2>Nieuwe opdracht toevoegen</h2>
    </v-card-title>
    <v-card-text>
      <v-form class="mt-3" ref="form" lazy-validation>
        <v-text-field v-model="assignmentName" label="Naam van de opdracht" required :rules="nameRules"></v-text-field>
      </v-form>
      <p>Voeg de punten per criteria hieronder in.</p>
    </v-card-text>
    <v-card-actions>
      <v-btn v-if="isEditable" color="primary" @click="saveEvaluation">
        <v-icon>save</v-icon> Opslaan
      </v-btn>
    </v-card-actions>
  </v-card>

  <modulelist :module="module" :evaluating="isEditable" :evaluations="evaluationsPerAssignment" :newEvaluation="newEvaluation" v-on:graded="graded"></modulelist>
</v-container>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import EvaluationHeader from "../evaluation/EvaluationHeader.vue"

import {
  name as nameRules
} from "../../constants/rules";
import {
  gradeKeys
} from "../../constants/grades";
import pdfMake from "pdfmake/build/pdfmake.min.js";

export default {
  name: "StudentEvaluation",
  components: {
    EvaluationHeader
  },
  data() {
    return {
      assignmentName: "",
      nameRules: nameRules,
      evaluationsPerAssignment: new Map(),
      gradeKeys: gradeKeys,
      newEvaluation: {},
      evaluationsheet: {},
      loaded: false
    };
  },
  methods: {
    graded() {},
    async saveEvaluation() {
      if (!this.$refs.form.validate()) {
        window.scrollTo(0, 0);
        return;
      };
      if (Object.keys(this.newEvaluation).length < 1) {
        alert("Vul minstens 1 punt in");
        window.scrollTo(0, 0);
        return;
      }
      const newScores = this.evaluationsheet.scores.concat([]);
      for (const criteriaid in this.newEvaluation) {
        const grade = this.newEvaluation[criteriaid];
        newScores.push({
          name: this.assignmentName,
          grade,
          criteriaid: +criteriaid,
        });
      }
      await this.$http.saveEvaluation(this.evaluationsheet.id, newScores);
      await this.fetchData();
    },
    async fetchData() {
      this.loaded = false;
      const evaluationid = this.$route.params.evaluationid;
      this.evaluationsheet = await this.$http.getEvaluationSheetById(evaluationid);
      this.evaluationsPerAssignment = this.evaluationsheet.scores.reduce((acc, evaluation, index) => {
        if (acc.get(evaluation.name)) {
          acc.get(evaluation.name).push(evaluation);
        } else {
          acc.set(evaluation.name, [evaluation]);
        }
        return acc;
      }, new Map());
      this.loaded = true;
    },
    async createReport() {
      const {
        reportid
      } = await this.$http.createReport(this.evaluationsheet.id);
      this.$router.push(`/rapport/${reportid}`);
    }
  },
  async created() {
    await this.fetchData();
  },
  computed: {
    ...mapGetters(["currentUser"]),
    student() {
      return this.evaluationsheet.student;
    },
    module() {
      return this.evaluationsheet.module;
    },
    discipline() {
      return this.evaluationsheet.discipline;
    },
    isEditable() {
      return !this.evaluationsheet.enddate;
    }
  }

};
</script>
