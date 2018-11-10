<template>
<v-card>
    <v-card-title>
        <v-layout align-center justify-space-between row>
            <h2>Opleiding</h2>
            <v-btn color="primary" class="ma-1" dark @click="$emit('update:model', !model)">
                <v-icon dark>edit</v-icon>
                {{!model ? "Aanpassen" : "stop aanpassen"}}
            </v-btn>
        </v-layout>
    </v-card-title>
    <v-card-text>
        <v-layout align-center justify-space-between row fill-height>
            <v-select label="Opleiding" :readonly="!model" v-model="selected" v-on:change="updateDiscipline" :rules="selectOpleidingRules" :items="items"></v-select>
        </v-layout>
        <v-btn @click="$emit('confirm')" v-if="model" color="primary">Opleiding aanpassen</v-btn>
    </v-card-text>
</v-card>
</template>

<script>
import * as rules from "../../constants/rules";

export default {
    name: "ChooseDiscipline",
    props: ["items", "model", "discipline"],
    data() {
        return {
            selectOpleidingRules: rules.opleiding,
            selected: undefined
        };
    },
    methods: {
        updateDiscipline() {
            this.$emit('update:discipline', this.selected);
        }
    },
    beforeUpdate() {
        this.selected = this.discipline;
    }
};
</script>
