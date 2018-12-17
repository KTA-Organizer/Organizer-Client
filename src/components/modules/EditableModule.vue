<template>
<v-layout column>
    <v-layout row class="ml-5 mb-4">
        <h1 class="text-xs-left"><v-text-field name="modulenaam" label="Naam module" v-model="module.name" single-line></v-text-field></h1>
        <v-flex xs5 v-if="isAdmin">
            <v-btn color="success" @click="saveModule">
                Opslaan
                <span slot="loader" class="custom-loader">
                    <v-icon light>cached</v-icon>&nbsp;
                    </span>
            </v-btn>
            <v-btn color="primary" @click="clearUpdates, $emit('confirm'), $emit('update:edit', !edit)">Annuleren</v-btn>
        </v-flex> 
    </v-layout>
    <v-card class="mb-4" v-for="(categorie) in module.domains" :value="categorie.active" v-bind:key="categorie.name">
        <v-card-title primary-title v-if="categorie.active">
            <h3 class="headline fullWidth"><v-text-field name="categorienaam" label="Naam categorie" @change="addUpdateAddition('domain',categorie.id)" v-model="domainMap[categorie.id]" single-line></v-text-field></h3>
        </v-card-title>
        <v-card-text v-if="categorie.active">
            <v-data-table hide-headers :items="categorie.goals" hide-actions class="criteriaTable">
                <template slot="items" slot-scope="props">
                    <tr v-if="props.item.active">
                        <th class="oneThirdWidth"><v-text-field :multi-line="true" name="doelstellingnaam" label="Naam doelstelling" @change="addUpdateAddition('goal',props.item.id)" v-model="goalMap[props.item.id]" single-line></v-text-field></th>
                        <div v-for="(criteria) in props.item.criteria" v-bind:key="criteria.name">
                            <v-layout v-if="criteria.active" class="py-2 mt-2" row>
                                <v-layout>
                                    <v-flex>
                                        <td d-block class="text-xs-left pl-0 xs-5 oneThirdWidth">
                                            <v-layout row>
                                                <v-text-field name="criterianaam" label="Naam criteria" @change="addUpdateAddition('criteria',criteria.id)" v-model="criteriaMap[criteria.id]" single-line></v-text-field>
                                            </v-layout>
                                        </td>

                                        <v-divider></v-divider>
                                    </v-flex>
                                </v-layout>
                            </v-layout>
                        </div>
                    </tr>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: "editableModule",
    props: ["module", "edit"],
    data() {
        return {
            domainMap: {},
            goalMap: {},
            criteriaMap: {},
            updates: [],
            allGoals: [],
            allCriteria: []
        }
    },
    computed: mapGetters(["isAdmin"]),
    methods: {
        saveModule() {
            var self = this;
            self.$http.updateModule(
                this.module.id,
                this.module.name
            );
            this.sendUpdates();
        },
        addUpdateAddition(type, id) {
            this.updates.push({
                "type": type,
                "id": id
            });
        },
        sendUpdates() {
            var self = this;
            this.updates.forEach(update => {
                switch (update.type) {
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
            setTimeout(() => {
                self.$emit('confirm');
                self.$emit('update:edit', !this.edit);
            }, 500);
        },
        initializeDomainMap() {
            this.domainMap = this.module.domains.filter(x => x.active === 1).reduce((agg, val) => {
                return Object.assign(agg, {
                    [val.id]: val.name
                })
            }, {});
        },
        setAllGoalsAndCriteria() {
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
        initializeGoalMap() {
            this.goalMap = this.allGoals.filter(goal => goal.active === 1).reduce((agg, val) => {
                return Object.assign(agg, {
                    [val.id]: val.name
                })
            }, {});
        },
        initializeCriteriaMap() {
            this.criteriaMap = this.allCriteria.filter(criterion => criterion.active === 1).reduce((agg, val) => {
                return Object.assign(agg, {
                    [val.id]: val.name
                })
            }, {});
        },
        clearUpdates(){
            this.updates = [];
        }
    },
    async created() {
        this.initializeDomainMap();
        this.setAllGoalsAndCriteria();
    }
}
</script>

<style scoped>
.categorieTitle {
    width: 75%;
    margin-top: 3%;
}

.fullWidth {
    width: 100%;
}

.oneThirdWidth {
    width: 35%;
}
</style>
