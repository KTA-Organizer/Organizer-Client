<template>
    <v-dialog width="500" v-model="model">
        <v-card>
            <v-card-title class="headline grey lighten-2" primary-title>
                Aanmaak nieuwe opleiding
            </v-card-title>

            <v-card-text>
                <v-text-field label="Naam opleiding" v-model="nameNewDiscipline"></v-text-field>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" flat v-on:click="$emit('update:model', !model), nameNewDiscipline=''">
                    Annuleer
                </v-btn>
                <v-btn color="error" flat v-on:click="createNewDiscipline" :disabled="!nameNewDiscipline.length">
                    Bevestig
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    name: "newDisciplineDialog",
    data(){
        return{
            nameNewDiscipline: ""
        };
    },
    methods: {
        async createNewDiscipline(){
            this.$emit('update:model', false);
            await this.$http.createDiscipline(this.nameNewDiscipline);
            this.nameNewDiscipline= "";
            this.$emit('confirm');
        }
    },
    props: ["new", "confirm", "model"],
    watch: {
        model(){
            this.$emit('update:model', this.model);
        }
    }
}
</script>
