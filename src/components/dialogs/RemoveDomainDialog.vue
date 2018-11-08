<template>
    <v-dialog width="500" v-model="model">
        <v-card>
            <v-card-title class="headline grey lighten-2" primary-title>
                Verwijderen bestaand domein
            </v-card-title>

            <v-card-text>
                <v-text-field label="Naam domein" v-model="nameDomain"></v-text-field>
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
    data(){
        return{
            nameDomain: ""
        };
    },
    methods: {
        async removeDomain(){
            /*var self= this;
            console.log(this.nameDomain, this.moduleId);
            await this.$http.createDomain(this.nameDomain, this.moduleId);
            this.nameDomain= "";
            this.$emit('confirm');
            this.$emit('update:model', !this.model);*/
        }
    },
    props: ["new", "confirm", "model", "moduleId"]
}
</script>
