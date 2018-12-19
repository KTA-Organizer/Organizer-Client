<template>
<v-dialog width="500" v-model="model">
    <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
            Aanmaak nieuwe criteria
        </v-card-title>

        <v-card-text>
            <v-text-field label="Naam criteria" v-model="nameNewCriteria"></v-text-field>
        </v-card-text>

        <v-card-text>
            <v-text-field label="Gewicht" v-model="weightNewCriteria" :rules="weightRules" mask="###"></v-text-field>
        </v-card-text>

        <v-card-text>
            <v-select no-data-text="Geen data beschikbaar" :items="domainNames" v-model="selectedDomain" v-on:change="changedDomain" menu-props="auto" label="Naam domein" hide-details single-line></v-select>
        </v-card-text>
 
        <v-card-text>
            <v-select no-data-text="Geen data beschikbaar" :items="goalNames" v-model="selectedGoal" menu-props="auto" label="Naam doelstelling" hide-details single-line></v-select>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat v-on:click="$emit('update:model', !model), nameNewCriteria=''">
                Annuleer
            </v-btn>
            <v-btn color="error" flat v-on:click="createNewCriteria" :disabled="!nameNewCriteria.length || !selectedGoal || weightNewCriteria.length < 1">
                Bevestig
            </v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
</template>

<script>
import * as rules from "../../constants/rules";

export default {
    name: "newGoalDialog",
    props: ["new", "confirm", "model", "moduleId", "module"],
    data() {
        return {
            nameNewCriteria: "",
            weightNewCriteria: 1,
            domains: [],
            domainNames: null,
            goals: [],
            goalNames: [],
            selectedDomain: null,
            selectedGoal: null,
            weightRules: rules.weight
        };
    },
    methods: {
        async createNewCriteria() {
            this.$emit('update:model', false);

            const selectedGoalId = this.goals.filter(x => x.name === this.selectedGoal).map(x => x.id)[0];
            await this.$http.createCriteria(this.nameNewCriteria, this.weightNewCriteria, selectedGoalId);
            this.nameNewCriteria = "";
            this.weightNewCriteria = 1;
            this.$emit('confirm');
        },
        changedDomain(){
            this.goals = [];
            const domain = this.domains.filter(x => x.name === this.selectedDomain)[0];
            if(domain){
                    domain.goals.forEach(goal => {
                    this.goals.push(goal);
                })
                this.goalNames = this.goals.filter(x => x.active).map(x => x.name);
            }
        },
        refreshDomains(){
            this.domains = this.module.domains;
            this.domainNames = this.domains.filter(x => x.active).map(x => x.name);
            this.changedDomain();
        }
    },
    async created() {
        this.refreshDomains();
    },
    watch: {
        module(){
            this.refreshDomains();
        },
        model(){
            this.$emit('update:model', this.model);
        }
    }
}
</script>
