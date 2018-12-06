<template>
<v-dialog width="500" v-model="model">
    <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
            Aanmaak nieuwe doelstelling
        </v-card-title>

        <v-card-text>
            <v-text-field label="Naam doelstelling" v-model="nameNewGoal"></v-text-field>
        </v-card-text>

        <v-card-text>
            <v-select no-data-text="Geen data beschikbaar" :items="domainNames" v-model="selectedDomain" menu-props="auto" label="Naam domein" hide-details single-line></v-select>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat v-on:click="$emit('update:model', !model), nameNewGoal=''">
                Annuleer
            </v-btn>
            <v-btn color="error" flat v-on:click="createNewGoal">
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
            nameNewGoal: "",
            domains: null,
            domainNames: null,
            selectedDomain: null
        };
    },
    methods: {
        async createNewGoal() {
            this.$emit('update:model', false);
            const selectedDomainId = this.domains.filter(x => x.name === this.selectedDomain).map(x => x.id)[0];
            await this.$http.createGoal(this.nameNewGoal, selectedDomainId);
            this.nameNewGoal = "";
            this.$emit('confirm');
        },
        refreshDomains(){
            this.domains = this.module.domains;
            this.domainNames = this.domains.filter(x => x.active).map(x => x.name);
        }
    },
    async created() {
        this.refreshDomains();
    },
    watch: {
        module(){
            this.refreshDomains();
        }
    }
}
</script>
