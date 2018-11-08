<template>
    <v-dialog width="500" v-model="model">
        <v-card>
            <v-card-title class="headline grey lighten-2" primary-title>
                Verwijderen bestaand domein
            </v-card-title>

            <v-card-text>
                <v-select :items="domains" v-model="selectedDomain" menu-props="auto" label="Naam domain" hide-details single-line></v-select>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" flat v-on:click="$emit('update:model', !model), nameDomain=''">
                    Annuleer
                </v-btn>
                <v-btn color="error" flat v-on:click="removeDomain">
                    Bevestig
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    name: "newDomainDialog",
    props: ["new", "confirm", "model", "moduleId", "module"],
    data(){
        return{
            selectedDomain: "",
            domains: []
        };
    },
    methods: {
        async removeDomain(){
            var self= this;
            const domainId = this.module.domains.filter(x => x.name === this.selectedDomain).map(x => x.id)[0];
            await this.$http.setDomainInactive(domainId, this.moduleId);
            this.nameDomain= "";
            this.$emit('confirm');
            this.$emit('update:model', !this.model);
        }
    },
    async created() {
        var self = this;
        this.domains = this.module.domains.map(x => x.name);
    }
}
</script>
