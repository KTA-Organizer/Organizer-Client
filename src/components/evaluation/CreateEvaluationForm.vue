<template>
<v-container>
  <v-layout column>
    <v-card>
      <v-card-title primary-title>
        <h3 class="headline mb-0">Evaluaties opvragen / bewerken</h3>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
        <v-select no-data-text="Geen data beschikbaar" label="Opleiding" v-model="disciplineName" v-on:input="handleDisciplineChange" :items="disciplineNames" :rules="defaultRule" required></v-select>
        <v-select no-data-text="Geen data beschikbaar" label="Module" :disabled="modules.length < 1" v-model="moduleName" :items="moduleNames" :rules="defaultRule" required></v-select>
        <v-select no-data-text="Geen data beschikbaar" label="Student" v-on:input="fetchEvaluations" :disabled="students.length < 1" v-model="studentName" :items="studentNames" :rules="defaultRule" required></v-select>
        </v-form>
      </v-card-text>
    </v-card>

    <v-layout v-if="student" wrap>
      <v-flex v-for="evaluation in evaluations" v-bind:key="evaluation.id">
        <v-card class="mt-2">
          <v-card-title>
            <h3 class="headline">Student: {{studentName}}</h3>
          </v-card-title>
          <v-card-text>
            <p class="text-xs-left">Startdatum: {{formatDate(evaluation.startdate)}}</p>
            <p class="text-xs-left">Einddatum: {{formatDate(evaluation.enddate)}}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn v-if="!evaluation.enddate" color="primary" @click="updateEvaluation(evaluation.id)">
              <v-icon>edit</v-icon> aanvullen
            </v-btn>
            <v-btn v-else color="primary" @click="updateEvaluation(evaluation.id)">
              <v-icon>remove_red_eye</v-icon>&nbsp; Bekijk
            </v-btn>
            <v-btn v-if="!evaluation.enddate" color="error" @click="showEndEvaluation = true; evaluationToEnd = evaluation.id;">
              <v-icon>clear</v-icon>&nbsp; afsluiten
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout v-if="student" class="mt-4" justify-center>
      <v-btn xs12 @click="newEvaluationDialog" color="primary">
          <v-icon>add</v-icon>&nbsp;
          Maak nieuwe evaluatie
          </v-btn>
    </v-layout>

  </v-layout>

  <v-dialog width="500" v-model="newEvaluation">
    <v-card>
      <v-card-title>
        <h1>Nieuwe evaluatie</h1>
      </v-card-title>
      <v-card-text>
        <h2>Kies de startdatum:</h2>
        <v-date-picker v-model="newEvaluationDate" :landscape="true" :reactive="true">
        </v-date-picker>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="createNewEvaluation()">Maak aan</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <confirmdialog v-bind:model.sync="showEndEvaluation" v-on:confirm="endEvaluation" :name="'deze evaluatie'" :action="'beëindigen (permanent)'">
  </confirmdialog>

</v-container>
</template>

<script>
import {
  defaultRule
} from "../../constants/rules";
import moment from "moment";

export default {
  name: "EvaluationForm",
  data() {
    return {
      moduleName: undefined,
      disciplineName: undefined,
      studentName: undefined,
      disciplines: [],
      modules: [],
      students: [],
      defaultRule: defaultRule,
      newEvaluation: false,
      newEvaluationDate: new Date().toISOString().substr(0, 10),
      evaluations: [],
      showEndEvaluation: false,
      evaluationToEnd: undefined,
    };
  },
  methods: {
    formatDate(date) {
      if (!date) {
        return "Nog te bepalen";
      }
      return moment(date).format('LL');
    },
    async handleDisciplineChange() {
      if (!this.discipline) {
        return;
      }
      this.modules = await this.$http.getModulesForDiscipline(this.discipline.id);
      const result = await this.$http.getStudentsForDiscipline(this.discipline.id);
      this.students = result.items;
    },
    updateEvaluation(evaluationid) {
      if (this.$refs.form.validate()) {
        this.$router.push(`/Evaluatie/${evaluationid}`);
      }
    },
    newEvaluationDialog() {
      if (this.$refs.form.validate()) {
        this.newEvaluation = true;
      }
    },
    async createNewEvaluation() {
      const date = new Date(this.newEvaluationDate);
      console.log(this.student.id, this.module.id, date);
      const newEvaluationId = await this.$http.createNewEvaluation(this.student.id, this.module.id, date);
      console.log(newEvaluationId)
      this.$router.push(`/Evaluatie/${newEvaluationId.evaluationsheetid}`);
    },
    async fetchEvaluations() {
      this.evaluations = await this.$http.getEvaluationSheetsForStudentInModule(this.student.id, this.module.id);
      console.log(this.evaluations);
    },
    async endEvaluation(id) {
      await this.$http.endEvaluation(this.evaluationToEnd);
      this.evaluationToEnd = undefined;
      this.showEndEvaluation = false;
      await this.fetchEvaluations();
    },
    async fetchData() {
      this.disciplines = await this.$http.getDisciplines();
    }
  },
  async created() {
    await this.fetchData();
  },
  computed: {
    disciplineNames() {
      return this.disciplines.map(x => x.name);
    },
    moduleNames() {
      return this.modules.map(x => x.name);
    },
    filteredStudentNames() {
      console.log(this.studentNames);
      return this.studentNames.filter(x => x.discipline.id === this.selectedDiscipline.id);
    },
    studentNames() {
      return this.students.map(x => `${x.firstname} ${x.lastname}`);
    },
    discipline() {
      const index = this.disciplineNames.indexOf(this.disciplineName);
      return this.disciplines[index];
    },
    module() {
      const index = this.moduleNames.indexOf(this.moduleName);
      return this.modules[index];
    },
    student() {
      const index = this.studentNames.indexOf(this.studentName);
      return this.students[index];
    }
  }
};
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}
</script>
