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
        </v-icon>&nbsp;
        Opslaan
      </v-btn>
      <v-btn class="primary" @click="newModule=true">
        <v-icon>
          add
        </v-icon>&nbsp;
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
                  <v-icon dark>remove_red_eye</v-icon>&nbsp;
                  bekijken
                </v-btn>
              </router-link>
              <v-btn round color="error" class="ma-1" dark @click="setCurrentModule(props.item), deleteModule = true" v-if="isAdmin">
                <v-icon dark>delete</v-icon>&nbsp;
                verwijderen
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
  <newmoduledialog v-bind:model.sync="newModule" :disciplineId="discipline.id" v-on:confirm="getModules"></newmoduledialog>
  <confirmdialog v-bind:model.sync="deleteModule" v-on:confirm="removeModule" :name="'deze module'" :action="'verwijderen (permanent)'">
  </confirmdialog>
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
      currentModule: null,
      loader: null,
      loading: false,
      deleteModule: false,
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
    setCurrentModule(givenModule){
      this.currentModule = givenModule;
    },
    async removeModule() {
      await this.$http.deleteModule(this.currentModule.id);
      await this.getModules();
      this.deleteModule = false;
    },
    createOpleiding() {
      var self = this;
      this.$http.createOpleiding(this.currentUser.id, this.discipline.name).then(function (response) {
        if (!isNaN(response[0])) {
          self.discipline.id = response[0];
          self.discipline.name = self.discipline.name;
        }
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
      }
      this.loading = false;
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
