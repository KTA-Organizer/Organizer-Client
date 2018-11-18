<template>
<v-container v-if="loaded">
  <evaluation-header :evaluationSheet="evaluationsheet">
    <h1 class="text-xs-right">Evaluatiefiche opleiding {{discipline.name}}</h1>
    <h1 class="text-xs-right">Module: {{module.name}}</h1>
  </evaluation-header>
  <v-form class="mt-3" ref="form" lazy-validation v-if="isEditable">
    <v-text-field v-model="assignmentName" label="Naam van de opdracht" required :rules="nameRules"></v-text-field>
  </v-form>
  <v-layout row>
    <modulelist :module="module" :evaluating="isEditable" :evaluations="evaluationsPerAssignment" :newEvaluation="newEvaluation" v-on:graded="graded"></modulelist>
  </v-layout>
  <v-btn v-if="isEditable" color="primary" @click="saveEvaluation">
    <v-icon>save</v-icon> Opslaan
  </v-btn>
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

export default {
  name: "StudentEvaluation",
  components: {
    EvaluationHeader
  },
  data() {
    return {
      assignmentName: "",
      nameRules: nameRules,
      evaluations: [],
      evaluationsPerAssignment: new Map(),
      gradeKeys: gradeKeys,
      newEvaluation: {},
      evaluationsheet: {},
      loaded: false
    };
  },
  methods: {
    graded() {
      console.log("in evaluation", this.newEvaluation);
    },
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
      const newEvaluationObj = {
        evaluations: []
      }
      for (const criteriaid in this.newEvaluation) {
        const grade = this.newEvaluation[criteriaid];
        const score = {
          name: this.assignmentName,
          grade,
          criteriaid: +criteriaid,
          studentid: this.student.id,
          creatorId: this.currentUser.id
        }
        newEvaluationObj.evaluations.push(score);
      }
      console.log(newEvaluationObj);
      await this.$http.saveEvaluation(newEvaluationObj);
    }
  },
  async created() {
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
