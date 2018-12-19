<template>
    <v-dialog width="500" v-model="model">
        <v-card>
            <v-card-title class="headline grey lighten-2" primary-title>
                Opgelet!
            </v-card-title>

            <v-card-text>
                <p>U staat op het punt om <strong>{{ name }}</strong> te {{action}}.</p>
                <p>Bent u dit zeker?</p>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" flat v-on:click="$emit('update:model', false)">
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
    name: "ConfirmDialog",
    props: ["name", "action", "model"],
    watch: {
        model() {
            this.$emit('update:model', this.model);
        }
    }
}
</script>
