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
            <v-select :items="domainNames" v-model="selectedDomain" v-on:change="changedDomain" menu-props="auto" label="Naam domein" hide-details single-line></v-select>
        </v-card-text>
 
        <v-card-text>
            <v-select :items="goalNames" v-model="selectedGoal" menu-props="auto" label="Naam doelstelling" hide-details single-line></v-select>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat v-on:click="$emit('update:model', !model), nameNewCriteria=''">
                Annuleer
            </v-btn>
            <v-btn color="error" flat v-on:click="createNewCriteria">
                Bevestig
            </v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
</template>

<script>
export default {
    name: "newGoalDialog",
    props: ["new", "confirm", "model", "moduleId"],
    data() {
        return {
            nameNewCriteria: "",
            domains: [],
            domainNames: null,
            goals: [],
            goalNames: [],
            selectedDomain: null,
            selectedGoal: null
        };
    },
    methods: {
        async createNewCriteria() {
            var self = this;

            const selectedGoalId = this.goals.filter(x => x.name === this.selectedGoal).map(x => x.id)[0];
            await this.$http.createCriteria(this.nameNewCriteria, selectedGoalId);
            this.nameNewCriteria = "";
            this.$emit('confirm');
            this.$emit('update:model', !this.model);
        },
        changedDomain(){
            console.log("halloooo");
            console.log(this.selectedDomain);
            this.goals = [];
            const domain = this.domains.filter(x => x.name === this.selectedDomain)[0];
            console.log(domain);
            domain.goals.forEach(goal => {
                this.goals.push(goal);
            })
            this.goalNames = this.goals.map(x => x.name);
        }
    },
    async created() {
        var self = this;
        const module = await this.$http.getModule(this.moduleId);
        this.domains = module.domains;
        this.domainNames = this.domains.map(x => x.name);
        console.log(this.goals);
        console.log(this.goalNames);
    }
}
</script>
