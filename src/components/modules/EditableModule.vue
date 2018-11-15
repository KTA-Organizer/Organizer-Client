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
                <v-btn color="primary" @click="$emit('confirm'), $emit('update:edit', !edit)">Return</v-btn>
            </v-flex>
            
        </v-layout>
        <v-layout wrap class="ml-5" dark v-for="(categorie) in module.domains" :value="categorie.active" v-bind:key="categorie.name">
            <h2 class="categorieTitle text-xs-left" v-if="categorie.active"> <v-text-field name="categorienaam" label="Naam categorie" @change="addUpdateAddition('domain',categorie.id)" v-model="domainMap[categorie.id]" single-line ></v-text-field></h2>
            <v-data-table hide-headers :items="categorie.goals" hide-actions class="elevation-1 criteriaTable">
                <template slot="items" slot-scope="props" v-if="props.item.active">
                    <tr>
                        <th><v-text-field name="doelstellingnaam" label="Naam doelstelling" @change="addUpdateAddition('goal',props.item.id)" v-model="goalMap[props.item.id]" single-line></v-text-field></th>
                        <v-flex d-flex xs48 sm24 md12>
                            <v-layout row wrap>
                                <v-flex d-flex>
                                    <v-layout row wrap>
                                        <v-flex  v-for="(criteria) in props.item.criteria" v-bind:key="criteria.name" d-flex xs12>
                                            <div v-if="criteria.active"><td class="text-xs-left"><v-text-field name="criterianaam" label="Naam criteria" @change="addUpdateAddition('criteria',criteria.id)" v-model="criteriaMap[criteria.id]" single-line></v-text-field></td></div>
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
          domainMap: {},
          goalMap: {},
          criteriaMap: {},
          updates: [],
          allGoals: [],
          allCriteria: []
      }  
    },
    methods: {
        saveModule() {
            var self = this;
            self.$http.updateModule(
                this.module.id,
                this.module.name
            );
            this.sendUpdates();
        },
        addUpdateAddition(type, id){
            this.updates.push({"type": type, "id": id});
        },
        sendUpdates(){
            var self = this;
            this.updates.forEach(update => {
                switch(update.type){
                    case "domain":
                        self.$http.updateDomain(update.id, this.domainMap[update.id]);
                        break;
                    case "goal":
                        self.$http.updateGoal(update.id, this.goalMap[update.id]);
                        break;
                    case "criteria":
                        self.$http.updateCriteria(update.id, this.criteriaMap[update.id]);
                        break;
                }
            })
            this.updates = [];
        },
        initializeDomainMap(){
            this.domainMap = this.module.domains.filter(x => x.active === 1).reduce((agg, val) => {
                return Object.assign(agg, { [val.id]: val.name })
            }, {});
        },
        setAllGoalsAndCriteria(){
            this.module.domains.forEach(element => {
                element.goals.forEach(goal => {
                    this.allGoals.push(goal);
                    goal.criteria.forEach(criteria => {
                        this.allCriteria.push(criteria);
                    })
                })
            });
            this.initializeGoalMap();
            this.initializeCriteriaMap();
        },
        initializeGoalMap(){
            this.goalMap = this.allGoals.filter(goal => goal.active === 1).reduce((agg, val) => {
                return Object.assign(agg, { [val.id]: val.name })
            }, {});
        },
        initializeCriteriaMap(){
            this.criteriaMap = this.allCriteria.filter(criterion => criterion.active === 1).reduce((agg, val) => {
                return Object.assign(agg, { [val.id]: val.name })
            }, {});
        }
    },
    async created() {
        this.initializeDomainMap();
        this.setAllGoalsAndCriteria();
  }
}
</script>

<style scoped>
    .categorieTitle{
        width: 75%;
         margin-top: 3%;
    }
</style>

