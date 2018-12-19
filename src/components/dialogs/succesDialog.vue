<template>
<v-dialog width="500" v-model="model">
    <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
            Verwijderd!
        </v-card-title>

        <v-card-text>
            <p><strong>{{name}}</strong> is {{action}}.</p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat v-on:click="$router.push(`${link}`)">
                Terug naar overzicht
            </v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
</template>

<script>
export default {
    name: "SuccesDialog",
    props: ["name", "action", "model", "link"],
    watch: {
        model(){
            this.$emit('update:model', this.model);
        }
    }
}
</script>
