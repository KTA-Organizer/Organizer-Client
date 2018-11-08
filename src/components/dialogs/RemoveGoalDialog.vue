<template>
<v-dialog width="500" v-model="model">
    <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
            Verwijderen bestaande doelstelling
        </v-card-title>

        <v-card-text>
            <v-select :items="domainNames" v-model="selectedDomain" v-on:change="changedDomain" menu-props="auto" label="Naam domein" hide-details single-line></v-select>
        </v-card-text>

        <v-card-text>
            <v-select :items="goalNames" v-model="selectedGoal"  menu-props="auto" label="Naam doelstelling" hide-details single-line></v-select>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat v-on:click="$emit('update:model', !model), nameNewGoal=''">
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
            var self = this;

            const selectedGoalId = this.goals.filter(x => x.name === this.selectedGoal).map(x => x.id)[0];
            await this.$http.setGoalInactive(selectedGoalId);
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
            console.log(domain);
            domain.goals.forEach(goal => {
                this.goals.push(goal);
            })
            this.goalNames = this.goals.map(x => x.name);
            console.log(this.goalNames, "iere");
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
