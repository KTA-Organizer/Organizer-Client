<template>
    <v-dialog width="500" v-model="model">
        <v-card>
            <v-card-title class="headline grey lighten-2" primary-title>
                Aanmaak nieuwe module
            </v-card-title>

            <v-card-text>
                <p>Naam van de nieuwe module</p>
                <v-text-field placeholder="vul iets in"></v-text-field>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" flat v-on:click="$emit('update:model', !model)">
                    Annuleer
                </v-btn>
                <v-btn color="error" flat v-on:click="$emit('confirm')">
                    Bevestig
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    name: "newModuleDialog",
    props: ["new", "confirm", "model"]
}
</script>
