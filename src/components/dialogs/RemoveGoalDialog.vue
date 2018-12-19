<template>
<v-dialog width="500" v-model="model">
    <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
            Verwijderen bestaande doelstelling
        </v-card-title>

        <v-card-text>
            <v-select no-data-text="Geen data beschikbaar" :items="domainNames" v-model="selectedDomain" v-on:change="changedDomain" menu-props="auto" label="Naam domein" hide-details single-line></v-select>
        </v-card-text>

        <v-card-text>
            <v-select no-data-text="Geen data beschikbaar" :items="goalNames" v-model="selectedGoal"  menu-props="auto" label="Naam doelstelling" hide-details single-line></v-select>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat v-on:click="$emit('update:model', !model)">
                Annuleer
            </v-btn>
            <v-btn color="error" flat v-on:click="removeGoal">
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
            selectedDomain: null,
            selectedGoal: null
        };
    },
    methods: {
        async removeGoal() {
            this.$emit('update:model', !this.model);
            const selectedGoalId = this.goals.filter(x => x.name === this.selectedGoal).map(x => x.id)[0];
            await this.$http.setGoalInactive(selectedGoalId);
            this.$emit('confirm');
        },
        refreshDomains(){
            this.domains = this.module.domains.filter(x => x.active);
            this.domainNames = this.domains.filter(x => x.active).map(x => x.name);
        },
        changedDomain(){
            this.goals = [];
            const domain = this.domains.filter(x => x.name === this.selectedDomain)[0];
            if(domain){
                domain.goals.filter(x => x.active).forEach(goal => {
                this.goals.push(goal);
                })
                this.goalNames = this.goals.filter(x => x.active).map(x => x.name);
            }
        }
    },
    async created() {
        this.refreshDomains();
    },
    watch: {
        module(){
            this.refreshDomains();
            this.changedDomain();
        }
    }
}
</script>
