<template>
<div>
  <v-layout row-wrap>
    <v-flex xs4 offset-xs1>
      <searchbar @select-item="applySelection" :list="disciplines" :concat_keys="keys" :labeltext="'opleiding'" :item_concat_key="item_name" :item_value="item_value"></searchbar>
    </v-flex>
    <v-flex xs1 offset-xs4 class="mr-5">
      <v-btn v-if="isAdmin" class="primary" @click="addDiscipline=true">
        <v-icon>add</v-icon> Opleiding Aanmaken
      </v-btn>
    </v-flex>
  </v-layout>
  <v-layout row-wrap>
    <v-flex class="mt-5" offset-xs1 xs10>
      <disciplineDataTable v-on:dialogActivate="showDialogActivate" v-on:dialogDeactivate="showDialogDeactivate" :items="filteredList"></disciplineDataTable>
    </v-flex>
  </v-layout>
  <confirmdialog v-bind:model.sync="deactivateOpleidingStatus" v-on:confirm="deactivateOpleiding" :name="selectedOpleiding.name" :action="'deactiveren'">
  </confirmdialog>
  <confirmdialog v-bind:model.sync="activateOpleidingStatus" v-on:confirm="activateOpleiding" :name="selectedOpleiding.name" :action="'activeren'">
  </confirmdialog>
  <newdisciplinedialog v-bind:model.sync="addDiscipline" v-on:confirm="getDisciplines"></newdisciplinedialog>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "DisciplinesList",
  data() {
    return {
      disciplines: [],
      filteredList: [],
      addDiscipline: false,
      deactivateOpleidingStatus: false,
      activateOpleidingStatus: false,
      selectedOpleiding: {},

      keys: ["name"],
      item_name: "name",
      item_value: "id"
    };
  },
  computed: mapGetters(["isAdmin"]),
  methods: {
    applySelection(id) {
      if (!id) {
        this.filteredList = this.disciplines.concat([]);
      } else {
        this.filteredList = this.disciplines.filter(opl => opl.id === id);
      }
    },
    async deactivateOpleiding() {
      await this.$http.setOpleidingInactive(this.selectedOpleiding.id);
      this.deactivateOpleidingStatus = false;
      this.selectedOpleiding = {};
      this.getDisciplines();
    },
    async activateOpleiding() {
      await this.$http.setOpleidingActive(this.selectedOpleiding.id);
      this.activateOpleidingStatus = false;
      this.selectedOpleiding = {};
      this.getDisciplines();
    },
    checkSelected(id) {
      if (this.selectedid === null) {
        return true;
      } else if (this.selectedid === id) {
        return true;
      } else {
        return false;
      }
    },
    async getDisciplines() {
      this.disciplines = await this.$http.getDisciplines();
      this.applySelection();
    },
    showDialogActivate(opleidingen, opleiding) {
      this.activateOpleidingStatus = true;
      this.setSelectedOpleiding(opleidingen, opleiding);
    },
    showDialogDeactivate(opleidingen, opleiding) {
      this.deactivateOpleidingStatus = true;
      this.setSelectedOpleiding(opleidingen, opleiding);
    },
    setSelectedOpleiding(opleidingen, opleiding) {
      this.selectedOpleiding = opleiding;
    }
  },
  async created() {
    await this.getDisciplines();
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
div.menu__content--autocomplete {
  top: 165px !important;
}
</style>
