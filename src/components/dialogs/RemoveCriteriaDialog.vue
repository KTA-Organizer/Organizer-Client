<template>
<v-dialog width="500" v-model="model">
    <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
            Verwijderen bestaande criterion
        </v-card-title>

        <v-card-text>
            <v-select :items="domainNames" v-model="selectedDomain" v-on:change="changedDomain" menu-props="auto" label="Naam domein" hide-details single-line></v-select>
        </v-card-text>

        <v-card-text>
            <v-select :items="goalNames" v-model="selectedGoal" v-on:change="changedGoal"  menu-props="auto" label="Naam doelstelling" hide-details single-line></v-select>
        </v-card-text>

        <v-card-text>
            <v-select :items="criteriaNames" v-model="selectedCriteria"  menu-props="auto" label="Naam criteria" hide-details single-line></v-select>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat v-on:click="$emit('update:model', !model)">
                Annuleer
            </v-btn>
            <v-btn color="error" flat v-on:click="removeCriteria">
                Bevestig
            </v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
</template>

<script>
export default {
    name: "newGoalDialog",
    props: ["new", "confirm", "model", "moduleId", "module"],
    data() {
        return {
            domains: null,
            domainNames: null,
            goals: [],
            goalNames: [],
            criteria: [],
            criteriaNames: [],
            selectedDomain: null,
            selectedGoal: null,
            selectedCriteria: null
        };
    },
    methods: {
        async removeCriteria() {
            var self = this;

            const selectedCriteriaId = this.criteria.filter(x => x.name === this.selectedCriteria).map(x => x.id)[0];
            await this.$http.setCriteriaInactive(selectedCriteriaId);
            this.$emit('confirm');
            this.$emit('update:model', !this.model);
        },
        refreshDomains(){
            var self = this;
            this.domains = this.module.domains;
            this.domainNames = this.domains.map(x => x.name);
        },
        changedDomain(){
            var self = this;
            this.goals = [];
            const domain = this.domains.filter(x => x.name === this.selectedDomain)[0];
            domain.goals.forEach(goal => {
                this.goals.push(goal);
            })
            this.goalNames = this.goals.map(x => x.name);
        },
        changedGoal(){
            var self = this;
            this.criteria = [];
            const goal = this.goals.filter(x => x.name === this.selectedGoal)[0];
            goal.criteria.forEach(criterion => {
                this.criteria.push(criterion);
            })
            this.criteriaNames = this.criteria.map(x => x.name);
        }
    },
    async created() {
        var self = this;
        this.refreshDomains();
    },
    watch: {
        module(){
            this.refreshDomains();
        }
    }
}
</script>
