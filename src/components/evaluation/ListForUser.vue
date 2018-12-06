<template>
<v-layout wrap>
    <p v-if="!evaluations.length">Er zijn nog geen evaluatiefiches voor deze student.</p>
    <v-flex v-for="evaluation in evaluations" v-bind:key="evaluation.id">
        <v-card class="mt-2">
            <v-card-title>
                <h2>Evaluatie</h2>
            </v-card-title>
            <v-card-text>
                <v-layout>
                    <v-flex>
                        <p class="text-xs-left">Startdatum: {{formatDate(evaluation.startdate)}}</p>
                        <p class="text-xs-left">Einddatum: {{formatDate(evaluation.enddate)}}</p>
                    </v-flex>
                </v-layout>
            </v-card-text>
            <v-card-actions>
                <router-link :to="'/Evaluatie/' + evaluation.id">
                    <v-btn class="primary">
                        <v-icon>remove_red_eye</v-icon>Bekijken
                    </v-btn>
                </router-link>
            </v-card-actions>
        </v-card>
    </v-flex>
</v-layout>
</template>

<script>
import moment from "moment";

export default {
    name: "ListForUser",
    props: ["userid"],
    data() {
        return {
            evaluations: []
        };
    },
    methods: {
        formatDate(date) {
            if (!date) {
                return "Nog te bepalen";
            }
            return moment(date).format("LL");
        }
    },
    async created() {
        this.evaluations = await this.$http.getEvaluationSheetsForStudentInModule(
            this.userid
        );
    },
    computed: {}
};
</script>
