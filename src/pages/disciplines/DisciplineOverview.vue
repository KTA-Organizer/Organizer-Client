<template>
<main>
  <v-layout column class="ml-5 mb-3">
    <h1 class="text-xs-left">{{ discipline.name }}</h1>
  </v-layout>
  <v-card v-if="isAdmin" class="mb-3">
    <v-card-title>
      <h3 class="headline">Naam opleiding wijzigen</h3>
    </v-card-title>
    <v-card-text>
      <v-text-field :name="discipline.name" label="Naam van de opleiding" v-model="discipline.name" single-line></v-text-field>
      <v-btn color="success" :loading="loading" @click.native="saveOpleiding" :disabled="loading">
        <v-icon>
          save
        </v-icon>
        Opslaan
      </v-btn>
      <v-btn class="primary" @click="newModule=true">
        <v-icon>
          add
        </v-icon>
        Nieuwe Module
      </v-btn>
    </v-card-text>
  </v-card>
  <v-layout row wrap>
    <v-flex>
      <v-data-table v-bind:headers="headers" :items="modules" hide-actions class="elevation-1">
        <template slot="items" slot-scope="props">
          <tr v-if="props.item.active">
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-right">
              <router-link :to="{ name: 'Module', params: { moduleid: props.item.id }}" style="text-decoration: none">
                <v-btn round color="primary" class="ma-1" dark>
                  <v-icon dark>remove_red_eye</v-icon>
                  bekijken
                </v-btn>
              </router-link>
              <v-btn round color="error" class="ma-1" dark @click="removeModule(modules, props.item)" v-if="isAdmin">
                <v-icon dark>delete</v-icon>
                verwijderen
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
  <newmoduledialog v-bind:model.sync="newModule" :disciplineId="discipline.id" v-on:confirm="getModules"></newmoduledialog>
</main>
</template>

<script>
import {
  mapGetters
} from 'vuex';
export default {
  name: "DisciplineOverview",
  data() {
    return {
      headers: [{
          text: "Module",
          align: "left",
          value: "module",
          sortable: false
        },
        {
          text: "",
          value: "actionbtns",
          sortable: false
        }
      ],
      studentHeaders: [{
          text: "Naam",
          align: "left",
          value: "naam",
          sortable: true
        },
        {
          text: "Rol",
          align: "left",
          value: "role",
          sortable: true
        },
        {
          text: "Email",
          align: "left",
          value: "email",
          sortable: true
        },
        {
          text: "Geslacht",
          align: "left",
          value: "gender",
          sortable: true
        },
        {
          text: "Status",
          align: "left",
          value: "status",
          sortable: true
        },
        {
          text: "Datum aangemaakt",
          value: "accountCreatedTimestamp"
        }
      ],
      snackbar: false,
      newModule: false,
      modulenaam: "",
      editingCategorie: false,
      editingDoelstelling: false,
      editingCriteria: false,
      editingAspect: false,
      payload: null,
      addModuleActive: false,
      addCategorieActive: false,
      addDoelstellingActive: false,
      addCriteriaActive: false,
      addAspectenActive: false,
      selectedcategorie: null,
      selectedcriteria: null,
      ModuleAddString: "",
      CategorieAddString: "",
      DoelstellingAddString: "",
      CriteriaAddString: "",
      AspectenAddString: "",
      removeList: [],

      loader: null,
      loading: false,

      discipline: {},
      modules: [],
    };
  },
  computed: mapGetters(["currentUser", "isAdmin"]),
  methods: {
    async getModules() {
      const disciplineId = this.$route.params.disciplineid;

      const [discipline, modules] = await Promise.all([
        this.$http.getDiscipline(disciplineId),
        this.$http.getModulesForDiscipline(disciplineId),
      ]);

      this.discipline = discipline;
      modules.forEach(function (module, i) {
        module["indexes"] = [i + 1];
      });
      this.modules = modules;
    },
    enterAddition(title, object, level, parentIndexes) {
      if (title !== "") {
        switch (level) {
          case "module":
            object.push({
              name: title,
              new: true,
              indexes: [],
              doelstellingCategories: []
            });
            object[object.length - 1].indexes.push(object.length);
            break;
          case "categorie":
            var array = [];
            parentIndexes.forEach(function (item) {
              array.push(item);
            });
            object.push({
              name: title,
              new: true,
              indexes: array,
              doelstellingen: []
            });
            object[object.length - 1].indexes.push(object.length);
            break;
          case "doelstelling":
            array = [];
            parentIndexes.forEach(function (item) {
              array.push(item);
            });
            object.push({
              name: title,
              new: true,
              indexes: array,
              evaluatieCriteria: []
            });
            object[object.length - 1].indexes.push(object.length);
            break;
          case "criteria":
            array = [];
            parentIndexes.forEach(function (item) {
              array.push(item);
            });
            object.push({
              name: title,
              new: true,
              indexes: array,
              aspecten: []
            });
            object[object.length - 1].indexes.push(object.length);
            break;
          case "aspect":
            array = [];
            parentIndexes.forEach(function (item) {
              array.push(item);
            });
            object.push({
              name: title,
              new: true,
              indexes: array
            });
            object[object.length - 1].indexes.push(object.length);
            break;
        }
      }
      this.ModuleAddString = "";
      this.CategorieAddString = "";
      this.DoelstellingAddString = "";
      this.CriteriaAddString = "";
      this.AspectenAddString = "";
      this.addModuleActive = false;
      this.addCategorieActive = false;
      this.addDoelstellingActive = false;
      this.addCriteriaActive = false;
      this.addAspectenActive = false;
    },
    setCategorie(data) {
      this.selectedcategorie = data;
    },
    setCriteria(data) {
      this.selectedcriteria = data;
    },
    hideCategorie() {
      this.selectedcategorie = null;
      this.selectedcriteria = null;
      this.enterAddition("", this);
    },
    hideAspects() {
      this.selectedcriteria = null;
      this.enterAddition("", this);
    },
    editCategorie(payload) {
      this.payload = payload;
      this.editingCategorie = !this.editingCategorie;
      this.hideCategorie();
    },
    editDoelstelling(payload) {
      this.payload = payload;
      this.editingDoelstelling = !this.editingDoelstelling;
    },
    editCriteria(payload) {
      this.payload = payload;
      this.editingCriteria = !this.editingCriteria;
    },
    editAspect(payload) {
      this.payload = payload;
      this.editingAspect = !this.editingAspect;
    },
    removeModule(modules, module) {
      var self = this;
      self.removeList.push({
        "level": "module",
        "id": module.id
      });
      const modulesObj = JSON.parse(JSON.stringify(modules)); // to avoid vue js observer object
      const moduleIndex = modulesObj.indexOf(modulesObj.find(x => x.id == module.id));7
      const moduleId = modules[moduleIndex].id;
      modules.splice(moduleIndex, 1);
      console.log(moduleId);
      console.log(modulesObj);
      this.$http.deleteModule(moduleId);
    },
    removeCategorie(categories, categorie) {
      var self = this;
      self.removeList.push({
        "level": "categorie",
        "id": categorie.id
      });
      const categoriesObj = JSON.parse(JSON.stringify(categories)); // to avoid vue js observer object
      const categorieId = categoriesObj.indexOf(categoriesObj.find(x => x.id == categorie.id));
      categories.splice(categorieId, 1);
    },
    removeDoelstelling(doelstellingen, doelstelling) {
      var self = this;
      self.removeList.push({
        "level": "doelstelling",
        "id": doelstelling.id
      });
      const doelstellingenObj = JSON.parse(JSON.stringify(doelstellingen)); // to avoid vue js observer object
      const doelstellingId = doelstellingenObj.indexOf(doelstellingenObj.find(x => x.id == doelstelling.id));
      doelstellingen.splice(doelstellingId, 1);
    },
    removeCriteria(evaluatieCriteria, criteria) {
      var self = this;
      self.removeList.push({
        "level": "criteria",
        "id": criteria.id
      });
      const evaluatieCriteriaObj = JSON.parse(JSON.stringify(evaluatieCriteria)); // to avoid vue js observer object
      const criteriaId = evaluatieCriteriaObj.indexOf(evaluatieCriteriaObj.find(x => x.id == criteria.id));
      evaluatieCriteria.splice(criteriaId, 1);
    },
    removeAspect(aspecten, aspect) {
      var self = this;
      self.removeList.push({
        "level": "aspect",
        "id": aspect.id
      });
      const aspectenObj = JSON.parse(JSON.stringify(aspecten)); // to avoid vue js observer object
      const aspectId = aspectenObj.indexOf(aspecten.find(x => x.id == aspect.id));
      aspecten.splice(aspectId, 1);
    },
    createOpleiding() {
      var self = this;
      this.$http.createOpleiding(this.currentUser.id, this.discipline.name).then(function (response) {
        if (!isNaN(response[0])) {
          self.discipline.id = response[0];
          self.discipline.name = self.discipline.name;
        }
        self.saveModules();
      });
    },
    saveOpleiding() {
      this.loading = true;
      var self = this;
      if (this.discipline.id === null) {
        this.createOpleiding();
      } else {
        this.$http.updateDiscipline(
          this.discipline.id,
          this.discipline.name
        );
        this.removeDeletedItems();
      }
      // self.saveModules();
      this.loading = false;
    },
    saveModules() {
      var self = this;
      this.discipline.forEach(function (module) {
        if (module.id && !module.new) {
          self.$http.updateModule(
            module.id,
            module.name
          ).then(function () {
            self.saveDoelstellingscategorieen(module);
          });
        } else {
          self.$http.createModule(
            module.name,
            self.discipline.id,
            13,
            self.currentUser.id
          ).then(function (response) {
            module["id"] = response[0];
            module.new = false;
            self.saveDoelstellingscategorieen(module);
          });
        }
      });
      this.loading = null;
    },
    saveDoelstellingscategorieen(module) {
      var self = this;
      module.doelstellingCategories.forEach(function (categorie) {
        if (categorie.id && !categorie.new) {
          self.$http.updateDoelstellingscategorie(
            categorie.id,
            categorie.name
          ).then(function () {
            self.saveDoelstellingen(categorie);
          });
        } else {
          self.$http.createDoelstellingscategorie(
            categorie.name,
            module.id,
            self.currentUser.id
          ).then(function (response) {
            categorie["id"] = response[0];
            categorie.new = false;
            self.saveDoelstellingen(categorie);
          });
        }
      });
    },
    saveDoelstellingen(doelstellingscategorie) {
      var self = this;
      doelstellingscategorie.doelstellingen.forEach(function (doelstelling) {
        if (doelstelling.id && !doelstelling.new) {
          self.$http.updateDoelstelling(
            doelstelling.id,
            doelstelling.name
          ).then(function () {
            self.saveCriteria(doelstelling);
          });
        } else {
          self.$http.createDoelstelling(
            doelstelling.name,
            doelstellingscategorie.id,
            self.currentUser.id
          ).then(function (response) {
            doelstelling["id"] = response[0];
            doelstelling.new = false;
            self.saveCriteria(doelstelling);
          });
        }
      });
    },
    saveCriteria(doelstelling) {
      var self = this;
      doelstelling.evaluatieCriteria.forEach(function (criteria) {
        if (criteria.id && !criteria.new) {
          self.$http.updateCriteria(
            criteria.id,
            criteria.name
          ).then(function () {
            self.saveAspect(criteria);
          });
        } else {
          self.$http.createCriteria(
            criteria.name,
            doelstelling.id,
            self.currentUser.id,
            1
          ).then(function (response) {
            criteria["id"] = response[0];
            criteria.new = false;
            self.saveAspect(criteria);
          });
        }
      });
    },
    saveAspect(criteria) {
      var self = this;
      criteria.aspecten.forEach(function (aspect) {
        if (aspect.id && !aspect.new) {
          self.$http.updateAspect(
            aspect.id,
            aspect.name
          );
        } else {
          self.$http.createAspect(
            aspect.name,
            criteria.id,
            self.currentUser.id
          ).then(function (response) {
            aspect["id"] = response[0];
            aspect.new = false;
          });
        }
      });
    },
    removeDeletedItems() {
      var self = this;
      self.removeList.forEach(function (item) {
        switch (item.level) {
          case "module":
            self.$http.deleteModule(item.id);
            break;
          case "categorie":
            self.$http.deleteCategorie(item.id);
            break;
          case "doelstelling":
            self.$http.deleteDoelstelling(item.id);
            break;
          case "criteria":
            self.$http.deleteCriteria(item.id);
            break;
          case "aspect":
            self.$http.deleteAspect(item.id);
            break;
        }
      })
      self.removeList = [];
    }
  },
  watch: {},
  async created() {
    await this.getModules();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}

@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

@-o-keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
