<template>
<v-container>
  <h1>Rapport maken</h1>
  <v-form ref="form" lazy-validation>
    <v-select no-data-text="Geen data beschikbaar" label="Opleiding" v-model="disciplineName" v-on:input="handleDisciplineChange" :items="disciplineNames" :rules="defaultRule" required></v-select>
    <v-select no-data-text="Geen data beschikbaar" label="Module" :disabled="modules.length < 1" v-model="moduleName" :items="moduleNames" :rules="defaultRule" required></v-select>
    <v-select no-data-text="Geen data beschikbaar" label="Student" :disabled="students.length < 1" v-model="studentName" :items="studentNames" :rules="defaultRule" required></v-select>
    <v-btn :disabled="!disciplineName || !moduleName || !studentName" @click="onGenerateClick" color="primary">Genereer rapport</v-btn>
  </v-form>
</v-container>
</template>

<script>
import {
  defaultRule
} from "../../constants/rules";

export default {
  name: "CreateReport",
  data: () => ({
    disciplineName: undefined,
    disciplines: [],

    moduleName: undefined,
    modules: [],

    studentName: undefined,
    students: [],

    defaultRule: defaultRule,
  }),
  computed: {
    disciplineNames() {
      return this.disciplines.map(x => x.name);
    },
    moduleNames() {
      return this.modules.map(x => x.name);
    },
    filteredStudentNames() {
      return this.studentNames.filter(x => x.discipline.id === selectedDiscipline.id);
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
  },
  methods: {
    async handleDisciplineChange() {
      if (!this.discipline) {
        return;
      }
      this.modules = await this.$http.getModulesForDiscipline(this.discipline.id);
      const result = await this.$http.getStudentsForDiscipline(this.discipline.id);
      this.students = result.items;
    },
    async onGenerateClick() {
      const data = { moduleid: this.module.id, studendids: [this.student.id] }
      console.log(data)
    },
    async fetchData() {
      this.disciplines = await this.$http.getDisciplines();
    }
  },
  async created() {
    await this.fetchData();
  }
};
</script>
