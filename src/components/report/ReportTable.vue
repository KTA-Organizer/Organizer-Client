<template>
<v-container v-if="report">
    <v-flex>
        
    </v-flex>
    <h1 class="categorieTitle mb-4 text-xs-left">{{discipline}}</h1>
    <h2 class="text-xs-left mb-1">MODULE: {{module.name}}</h2>
    <v-flex wrap class="" dark v-for="(categorie) in module.domains" :value="categorie.active" v-bind:key="categorie.name">
        <v-flex v-for="domain in categorie.goals" v-bind:key="domain.id">
            <h3 class="text-xs-left mb-2">{{domain.name}}</h3>
            <v-data-table no-data-text="Geen criteria beschikbaar" :headers="headers" hide-actions :items="domain.criteria" class="elevation-1 mb-5">
                <template slot="headers" slot-scope="props">
                    <tr class="headers">
                        <th v-for="header in props.headers" :key="header.text">
                            <div v-if="header.class === 'vertical'" class="vertical">{{ header.text }}</div>
                            <div v-else>{{ header.text }}</div>
                        </th>
                    </tr>
                </template>
                <template slot="items" slot-scope="props">
                    <tr>
                        <td class="text-xs-left">{{ props.item.name }}</td>
                        <td>{{getScore(props.item.id, "G")}}</td>
                        <td>{{getScore(props.item.id, "V")}}</td>
                        <td>{{getScore(props.item.id, "OV")}}</td>
                        <td>{{getScore(props.item.id, "RO")}}</td>
                        <td><v-text-field v-bind:key="props.item.id" label="Opmerking"></v-text-field></td>
                    </tr>
                </template>
            </v-data-table>
        </v-flex>
    </v-flex>
</v-container>
</template>

<script>
import * as grades from "../../constants/grades";
import * as helper from "../../constants/helpers";

export default {
    name: "ReportTable",
    props: ["report", "module", "discipline"],
    data() {
        return {
            headers: [{
                    text: "Vakken",
                    sortable: false
                },
                {
                    text: "Goed",
                    sortable: false,
                    class: "vertical"
                },
                {
                    text: "Voldoende",
                    sortable: false,
                    class: "vertical"
                },
                {
                    text: "Onvoldoende",
                    sortable: false,
                    class: "vertical"
                },
                {
                    text: "Ruim onvoldoende",
                    sortable: false,
                    class: "vertical"
                },
                {
                    text: "Opmerkingen",
                    sortable: false
                }
            ]
        }
    },
    methods: {
        getScore(criteriaid, key) {
            const score = this.report.find(x => x.criteriaid === criteriaid);
            if (!score) return "NVT";
            const result = score ? this.getScoreKey(score.average) : "NVT";
            return result === key ? "X" : "";
        },
        getScoreKey(score) {
            const scoreToFind = Math.round(score);
            return grades.gradeKeys[helper.getKeyByValue(grades.gradeValues, scoreToFind)];
        },
    },
}
</script>

<style scoped>
.vertical {
    transform: rotate(270deg);
}
.headers {
    line-height: 8em;
}
</style>
