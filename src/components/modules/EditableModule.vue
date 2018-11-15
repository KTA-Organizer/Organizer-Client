<template>
    <v-container>
        <v-layout row class="ml-5 mb-4">
            <v-flex xs4>
                <v-text-field name="modulenaam" label="Naam module" v-model="module.name" single-line></v-text-field>
            </v-flex>
            <v-flex xs5>
                <v-btn color="success" @click="saveModule">
                    Opslaan
                    <span slot="loader" class="custom-loader">
                    <v-icon light>cached</v-icon>
                    </span>
                </v-btn>
                <v-btn color="primary" @click="$emit('update:edit', !edit)">Return</v-btn>
            </v-flex>
            
        </v-layout>
        <v-layout wrap class="ml-5" dark v-for="(categorie) in module.domains" :value="categorie.active" v-bind:key="categorie.name">
            <h2 class="categorieTitle text-xs-left"> <v-text-field name="categorienaam" label="Naam categorie" @change="addUpdateAddition("goal",categorie.id)" v-model="moduleMap[categorie.id]" single-line ></v-text-field></h2>
            <v-data-table hide-headers :items="categorie.goals" hide-actions class="elevation-1 criteriaTable">
                <template slot="items" slot-scope="props">
                    <tr>
                        <th><v-text-field name="doelstellingnaam" label="Naam doelstelling" v-model="goalMap[props.item.id]" single-line></v-text-field></th>
                        <v-flex d-flex xs48 sm24 md12>
                            <v-layout row wrap>
                                <v-flex d-flex>
                                    <v-layout row wrap>
                                        <v-flex  v-for="(criteria) in props.item.criteria" v-bind:key="criteria.name" d-flex xs12>
                                            <div><td class="text-xs-left"><v-text-field name="criterianaam" label="Naam criteria" v-model="criteriaMap[criteria.id]" single-line></v-text-field></td></div>
                                            <v-divider></v-divider>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </tr>
                </template>
            </v-data-table>
        </v-layout>

    </v-container>
</template>
<script>
export default {
    name: "editableModule",
    props: ["module", "edit"],
    data(){
      return{
          moduleMap: {},
          goalMap: {},
          criteriaMap: {},
          updates: []
      }  
    },
    methods: {
        saveModule() {
            var self = this;
            self.$http.updateModule(
                this.module.id,
                this.module.name
            );
            this.updates.forEach(update => {
                switch(update.type){
                    case "domain":

                        break;
                    case "goal":
                        break;
                    case "criteria":
                        break;
                }
            })
        },
        addUpdateAddition(type, id){
            this.updates.push(type, id);
        }
    },
    async created() {
        console.log(this.module);
        this.moduleMap = this.module.domains.filter(x => x.active === 1).reduce((agg, val) => {
        return Object.assign(agg, { [val.id]: val.name })
      }, {});
      const allGoals = [];
      const allCriteria = [];
        this.module.domains.forEach(element => {
            element.goals.forEach(goal => {
                allGoals.push(goal);
                goal.criteria.forEach(criteria => {
                    allCriteria.push(criteria);
                })
            })
        });
        this.goalMap = allGoals.filter(x => x.active === 1).reduce((agg, val) => {
        return Object.assign(agg, { [val.id]: val.name })
      }, {});
      this.criteriaMap = allCriteria.filter(x => x.active === 1).reduce((agg, val) => {
        return Object.assign(agg, { [val.id]: val.name })
      }, {});
      console.log(this.moduleMap);
      console.log(this.goalMap);
      console.log(this.criteriaMap);
  }
}
</script>
