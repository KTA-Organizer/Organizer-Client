<template>
    <v-dialog width="500" v-model="model">
        <v-card>
            <v-card-title class="headline grey lighten-2" primary-title>
                Aanmaak nieuwe module
            </v-card-title>

            <v-card-text>
                <v-text-field label="Naam module" v-model="nameNewModule"></v-text-field>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" flat v-on:click="$emit('update:model', !model), nameNewModule=''">
                    Annuleer
                </v-btn>
                <v-btn color="error" flat v-on:click="createNewModule" :disabled="!nameNewModule.length">
                    Bevestig
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    name: "newModuleDialog",
    data(){
        return{
            nameNewModule: ""
        };
    },
    methods: {
        async createNewModule(){
            this.$emit('update:model', false);
            await this.$http.createModule(this.nameNewModule, this.disciplineId);
            this.nameNewModule= "";
            this.$emit('confirm');
        }
    },
    props: ["new", "confirm", "model", "disciplineId"],
    watch: {
        model(){
            this.$emit('update:model', this.model);
        }
    }
}
</script>
