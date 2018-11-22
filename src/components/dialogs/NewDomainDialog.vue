<template>
    <v-dialog width="500" v-model="model">
        <v-card>
            <v-card-title class="headline grey lighten-2" primary-title>
                Aanmaak nieuw domein
            </v-card-title>

            <v-card-text>
                <v-text-field label="Naam domein" v-model="nameNewDomain"></v-text-field>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" flat v-on:click="$emit('update:model', !model), nameNewDomain=''">
                    Annuleer
                </v-btn>
                <v-btn color="error" flat v-on:click="createNewDomain">
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
            nameNewDomain: ""
        };
    },
    methods: {
        async createNewDomain(){
            var self= this;
            console.log(this.nameNewDomain, this.moduleId);
            await this.$http.createDomain(this.nameNewDomain, this.moduleId);
            this.nameNewDomain= "";
            this.$emit('confirm');
            this.$emit('update:model', false);
        }
    },
    props: ["new", "confirm", "model", "moduleId"]
}
</script>
