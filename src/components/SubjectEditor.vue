<template>
  <main>
    <v-layout row class="ml-5">
        <v-flex xs4>
          <v-text-field
            name="opleidingsnaam"
            label="Naam van de opleiding"
            v-model="opleidingsnaam"
            single-line
          ></v-text-field>
        </v-flex>
        <v-flex xs5>
          <v-btn
                color="success"
                :loading="loading"
                @click.native="saveOpleiding"
                :disabled="loading"
              >
                Opslaan
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
              </v-btn>
        </v-flex>
    </v-layout>
    <v-layout row-wrap class="ml-5">
      <!-- MODULES & CATEGORIEEN DISPLAY-->
      <v-flex xs3 class="mr-0 pa-0">
          <v-list dark class="blue darken-3 pa-0">
              <!--<v-list-group v-for="(module, moduleIndex) in opleiding" :value="module.active" v-bind:key="module.name" v-if="editingModule">-->
                <!--<v-list-tile>-->
                  <!--<v-list-tile-content>-->
                    <!--<v-list-tile-title v-if="moduleIndex !== payload">{{ moduleIndex + 1 + ' ' + module.name }}</v-list-tile-title>-->
                    <!--<v-text-field @keyup.enter="editModule(null)" dark autofocus v-if="moduleIndex === payload" name="module" label="Module naam" v-model="module.name" single-line></v-text-field>-->
                  <!--</v-list-tile-content>-->
                <!--</v-list-tile>-->
              <!--</v-list-group>-->

              <v-list-group uid="0" class="blue darken-3" dark v-for="(module, moduleIndex) in opleiding" :value="module.active" v-bind:key="module.name">
                <v-list-tile slot="activator">
                  <v-list-tile-content v-if="!editingModule || moduleIndex != payload">
                    <v-list-tile-title>{{module.name}}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-btn flat icon color="blue lighten-2" v-if="!editingModule" @click="editModule(moduleIndex)">
                    <v-icon>edit</v-icon>
                  </v-btn>
                  <v-text-field v-if="editingModule && payload === moduleIndex" @keyup.enter="editModule(null)" dark autofocus name="module" label="Module naam" v-model="module.name" single-line></v-text-field>
                </v-list-tile>
                <v-list-tile class="blue-grey darken-2" v-for="(categorie,categorieIndex) in module.doelstellingCategories" v-bind:key="categorieIndex" @click="payload=categorieIndex">
                  <v-list-tile-content @click="setCategorie(categorie)" v-if="!editingCategorie || categorieIndex != payload">
                    <v-list-tile-title>{{ categorie.name }}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-btn flat icon color="blue lighten-2 text-xs-right" v-if="!editingCategorie" @click="editCategorie(categorieIndex)">
                    <v-icon>edit</v-icon>
                  </v-btn>
                  <v-text-field v-if="editingCategorie && payload === categorieIndex" @keyup.enter="editCategorie(null)" dark autofocus name="module" label="Categorie naam" v-model="categorie.name" single-line></v-text-field>
                </v-list-tile>
                <v-list-tile class="blue-grey darken-2">
                  <v-text-field
                    class="pb-2"
                    auto-focus
                    v-if="addCategorieActive"
                    @keyup.enter="enterAddition(CategorieAddString, module.doelstellingCategories, 'categorie', module.indexes)"
                    prepend-icon="add"
                    label="Nieuwe Categorie"
                    v-model="CategorieAddString"
                    single-line
                    hide-details
                    dark
                  ></v-text-field>
                  <v-btn flat color="white darken-1" v-if="!addCategorieActive" @click="addCategorieActive = true">+ Nieuwe Categorie</v-btn>
                </v-list-tile>
              </v-list-group>

              <v-list-tile class="white--text">
                <v-text-field
                  class="pb-2"
                  auto-focus
                  v-if="addModuleActive"
                  @keyup.enter="enterAddition(ModuleAddString, opleiding, 'module')"
                  prepend-icon="add"
                  label="Nieuwe Module"
                  v-model="ModuleAddString"
                  single-line
                  hide-details
                  dark
                ></v-text-field>
                <v-btn flat color="white darken-1" v-if="!addModuleActive" @click="addModuleActive = true" full-width>+ Nieuwe Module</v-btn>
              </v-list-tile>
            </v-list>
      </v-flex>
      <!-- DOELSTELLINGEN & EVALUATIECRITERIA DISPLAY-->
      <v-flex xs4 class="mr-0 pa-0" v-if="selectedcategorie != null">
        <v-list dark class="blue darken-3 pa-0">
            <!--<v-list-group v-for="(doelstelling, doelstellingIndex) in selectedcategorie.doelstellingen" :value="doelstelling.active" v-bind:key="doelstelling.name" v-if="editingDoelstelling">-->
              <!--<v-list-tile slot="activator">-->
                <!--<v-list-tile-content>-->
                  <!--<v-list-tile-title v-if="doelstellingIndex !== payload">{{doelstelling.id}}</v-list-tile-title>-->
                  <!--<v-text-field @keyup.enter="editDoelstelling(null)" dark autofocus v-if="doelstellingIndex === payload" name="module" label="Doelstelling naam" v-model="doelstelling.name" single-line></v-text-field>-->
                <!--</v-list-tile-content>-->
              <!--</v-list-tile>-->
            <!--</v-list-group>-->
            <v-list-group class="blue darken-3" dark v-for="(doelstelling, doelstellingIndex) in selectedcategorie.doelstellingen"  :value="doelstelling.active" v-bind:key="doelstelling.name">
              <v-list-tile slot="activator" @click="hideAspects">
                <v-list-tile-content  v-if="!editingDoelstelling || doelstellingIndex != payload">
                  <v-list-tile-title>{{ doelstelling.name }}</v-list-tile-title>
                </v-list-tile-content>
                <v-btn flat icon color="blue lighten-2" v-if="!editingDoelstelling" @click="editDoelstelling(doelstellingIndex)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-text-field v-if="editingDoelstelling && payload === doelstellingIndex" @keyup.enter="editDoelstelling(null)" dark autofocus name="doelstelling" label="Doelstelling naam" v-model="doelstelling.name" single-line></v-text-field>
              </v-list-tile>
              <v-list-tile class="blue-grey darken-2"  v-for="(criteria, criteriaIndex) in doelstelling.evaluatieCriteria" v-bind:key="criteriaIndex" @click="setCriteria(criteria)">
                <v-list-tile-content @click="setCriteria(criteriaIndex)" v-if="!editingCriteria || criteriaIndex != payload">
                  <v-list-tile-title>{{ criteria.name}}</v-list-tile-title>
                </v-list-tile-content>
                <v-btn flat icon color="blue lighten-2 text-xs-right" v-if="!editingCriteria" @click="editCriteria(criteriaIndex)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-text-field v-if="editingCriteria && payload === criteriaIndex" @keyup.enter="editCriteria(null)" dark autofocus name="module" label="Criteria naam" v-model="criteria.name" single-line></v-text-field>
              </v-list-tile>
              <v-list-tile class="blue-grey darken-2">
                <v-text-field
                  class="pb-2"
                  auto-focus
                  v-if="addCriteriaActive"
                  @keyup.enter="enterAddition(CriteriaAddString, doelstelling.evaluatieCriteria, 'criteria', doelstelling.indexes)"
                  prepend-icon="add"
                  label="Nieuwe Criteria"
                  v-model="CriteriaAddString"
                  single-line
                  hide-details
                  dark
                ></v-text-field>
                <v-btn flat color="white darken-1" v-if="!addCriteriaActive" @click="addCriteriaActive = true">+ Nieuwe Criteria</v-btn>
              </v-list-tile>
            </v-list-group>

            <v-list-tile class="white--text">
              <v-text-field
                class="pb-2"
                auto-focus
                v-if="addDoelstellingActive"
                @keyup.enter="enterAddition(DoelstellingAddString, selectedcategorie.doelstellingen, 'doelstelling', selectedcategorie.indexes )"
                prepend-icon="add"
                label="Nieuwe Doelstelling"
                v-model="DoelstellingAddString"
                single-line
                hide-details
                dark
              ></v-text-field>
              <v-btn flat color="white darken-1" v-if="!addDoelstellingActive" @click="addDoelstellingActive = true" full-width>+ Nieuwe Doelstelling</v-btn>
            </v-list-tile>
          </v-list>
      </v-flex>
      <!-- DOELSTELLINGEN & EVALUATIECRITERIA DISPLAY-->
      <v-flex xs4 class="mr-0 pa-0" v-if="selectedcriteria != null">
        <v-list dark class="blue darken-3 pa-0">
            <!--<v-list-group v-for="(aspect, aspectIndex) in selectedcriteria.aspecten" :value="aspect.active" v-bind:key="aspect.name" v-if="editingAspect">-->
              <!--<v-list-tile slot="activator">-->
                <!--<v-list-tile-content>-->
                  <!--<v-list-tile-title v-if="aspectIndex !== payload">{{ aspect.indexes.toString().replace(/,/g, ".") + ' ' + aspect.name }}</v-list-tile-title>-->
                  <!--<v-text-field @keyup.enter="editAspect(null)" dark autofocus v-if="aspectIndex === payload" name="module" label="Aspect naam" v-model="aspect.name" single-line></v-text-field>-->
                <!--</v-list-tile-content>-->
              <!--</v-list-tile>-->
            <!--</v-list-group>-->
            <v-list-group class="blue darken-3" dark v-for="(aspect, aspectIndex) in selectedcriteria.aspecten" :value="aspect.active" v-bind:key="aspect.name">
              <v-list-tile slot="activator" @click="enterAddition('', opleiding)">
                <v-list-tile-content v-if="!editingAspect || aspectIndex != payload">
                  <v-list-tile-title>{{ aspect.name }}</v-list-tile-title>
                </v-list-tile-content>
                <v-btn flat icon color="blue lighten-2" v-if="!editingAspect" @click="editAspect(aspectIndex)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-text-field v-if="editingAspect && payload === aspectIndex" @keyup.enter="editAspect(null)" dark autofocus name="aspect" label="Aspect naam" v-model="aspect.name" single-line></v-text-field>
              </v-list-tile>
            </v-list-group>
            <v-list-tile class="white--text">
              <v-text-field
                class="pb-2"
                auto-focus
                v-if="addAspectenActive"
                @keyup.enter="enterAddition(AspectenAddString, selectedcriteria.aspecten, 'aspect', selectedcriteria.indexes )"
                prepend-icon="add"
                label="Nieuw Aspect"
                v-model="AspectenAddString"
                single-line
                hide-details
                dark
              ></v-text-field>
              <v-btn flat color="white darken-1" v-if="!addAspectenActive" @click="addAspectenActive = true" full-width>+ Nieuw Aspect</v-btn>
            </v-list-tile>
          </v-list>
      </v-flex>
    </v-layout>
  </main>
</template>

<script>
import * as api from "../services/organizer-api";
export default {
  name: "SubjectEditor",
  props: ["givenmajor"],
  data() {
    return {
      snackbar: false,
      opleidingsnaam: "",
      editingModule: false,
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
      opleiding: [],
      loader: null,
      loading: false,
      currentUserId: this.$store.getters.currentUser.id
    };
  },
  methods: {
    enterAddition(title, object, level, parentIndexes) {
      if (title !== "") {
        switch(level){
          case "module":
            object.push({ name: title, new: true, indexes: [], doelstellingCategories: [] });
            object[object.length - 1].indexes.push(object.length);
            break;
          case "categorie":
            var array = [];
            parentIndexes.forEach(function(item) {
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
            parentIndexes.forEach(function(item) {
              array.push(item);
            });
            object.push({ name: title, new: true, indexes: array, evaluatieCriteria: [] });
            object[object.length - 1].indexes.push(object.length);
            break;
          case "criteria":
            array = [];
            parentIndexes.forEach(function(item) {
              array.push(item);
            });
            object.push({ name: title, new: true, indexes: array, aspecten: [] });
            object[object.length - 1].indexes.push(object.length);
            break;
          case "aspect":
            array = [];
            parentIndexes.forEach(function(item) {
              array.push(item);
            });
            object.push({ name: title, new: true, indexes: array });
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
      this.enterAddition("", this.opleiding);
    },
    hideAspects() {
      this.selectedcriteria = null;
      this.enterAddition("", this.opleiding);
    },
    editModule(payload) {
      this.payload = payload;
      this.editingModule = !this.editingModule;
      this.hideCategorie();
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
    createOpleiding() {
      var self = this;
      this.$http.createOpleiding(this.currentUserId, this.opleidingsnaam).then(function(response) {
        if (!isNaN(response[0])) {
          self.givenmajor.id = response[0];
          self.givenmajor.name = self.opleidingsnaam;
        }
        self.saveModules();
      });
    },
    saveOpleiding() {
      this.loading = true;
      var self = this;
      if (this.givenmajor.id === null) {
        this.createOpleiding();
      } else {
        this.$http.updateOpleiding(
          this.givenmajor.id,
          this.opleidingsnaam
          /*function(response) {
            console.log(response);
            //self.saveModules();*/
          //}
        );
      }
      self.saveModules();
      this.loading = false;
    },
    saveModules() {
      var self = this;
      this.opleiding.forEach(function(module) {
        if (module.id && !module.new) {
          self.$http.updateModule(
            module.id,
            module.name
            ).then(function(){
              self.saveDoelstellingscategorieen(module);
            });
        } else {
          self.$http.createModule(
            module.name,
            self.givenmajor.id,
            13,
            self.currentUserId
          ).then(function(response) {
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
      module.doelstellingCategories.forEach(function(categorie) {
        if (categorie.id && !categorie.new) {
          self.$http.updateDoelstellingscategorie(
            categorie.id,
            categorie.name
          ).then(function(){
              self.saveDoelstellingen(categorie);
          });
        } else {
          self.$http.createDoelstellingscategorie(
            categorie.name,
            module.id,
            self.currentUserId
          ).then(function(response) {
              categorie["id"] = response[0];
              categorie.new = false;
              self.saveDoelstellingen(categorie);
            });
        }
      });
    },
    saveDoelstellingen(doelstellingscategorie) {
      var self = this;
      doelstellingscategorie.doelstellingen.forEach(function(doelstelling) {
        if (doelstelling.id && !doelstelling.new) {
          self.$http.updateDoelstelling(
            doelstelling.id,
            doelstelling.name
          ).then(function(){
            self.saveCriteria(doelstelling);
          });
        } else {
          self.$http.createDoelstelling(
            doelstelling.name,
            doelstellingscategorie.id,
            self.currentUserId
          ).then(function(response) {
              doelstelling["id"] = response[0];
              doelstelling.new = false;
              self.saveCriteria(doelstelling);
            });
        }
      });
    },
    saveCriteria(doelstelling) {
      var self = this;
      doelstelling.evaluatieCriteria.forEach(function(criteria) {
        if (criteria.id && !criteria.new) {
          self.$http.updateCriteria(
            criteria.id,
            criteria.name
          ).then(function(){
            self.saveAspect(criteria);
          });
        } else {
          self.$http.createCriteria(
            criteria.name,
            doelstelling.id,
            self.currentUserId,
            1
          ).then(function(response) {
              criteria["id"] = response[0];
              criteria.new = false;
              self.saveAspect(criteria);
            });
        }   
      });
    },
    saveAspect(criteria) {
      var self = this;
      criteria.aspecten.forEach(function(aspect) {
        if (aspect.id && !aspect.new) {
          self.$http.updateAspect(
            aspect.id,
            aspect.name
          );
        } else {
          self.$http.createAspect(
            aspect.name,
            criteria.id,
            self.currentUserId
          ).then(function(response) {
                aspect["id"] = response[0];
                aspect.new = false;
            });
        }
      });
    }
  },
  watch: {},
  computed: {
    deactivateModuleHeaders: function() {
      if (this.editingModule === true) {
        this.$children[2].$children[this.payload + 1].isActive = false;
      }
    }
  },
  async created() {
    var self = this;
    if (this.givenmajor != null) {
      this.opleidingsnaam = self.givenmajor.name;
      const fullOpleiding = await api.getFullOpleiding(this.givenmajor.id);
      console.log("FullOpleiding", fullOpleiding);
      fullOpleiding.modules.forEach(function(module, moduleindex) {
        module["indexes"] = [moduleindex + 1];
        module.doelstellingCategories.forEach(function(
          categorie,
          categorieIndex
        ) {
          categorie["indexes"] = [moduleindex + 1, categorieIndex + 1];
          categorie.doelstellingen.forEach(function(
            doelstelling,
            doelstellingIndex
          ) {
            doelstelling["indexes"] = [
              moduleindex + 1,
              categorieIndex + 1,
              doelstellingIndex + 1
            ];
            doelstelling.evaluatieCriteria.forEach(function(criterium, criteriumIndex) {
              criterium["indexes"] = [
                moduleindex + 1,
                categorieIndex + 1,
                doelstellingIndex + 1,
                criteriumIndex + 1
              ];
              criterium.aspecten.forEach(function(aspect, aspectIndex) {
                aspect["indexes"] = [
                  moduleindex + 1,
                  categorieIndex + 1,
                  doelstellingIndex + 1,
                  criteriumIndex + 1,
                  aspectIndex + 1
                ];
              });
            });
          });
        });
      });
      self.opleiding = fullOpleiding.modules;
    }
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
