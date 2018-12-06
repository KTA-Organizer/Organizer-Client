<template>
<v-layout wrap>
    <v-flex v-for="report in reports" v-bind:key="report.id">
        <v-card class="mt-2">
            <v-card-title>
                <h2>Rapport</h2>
            </v-card-title>
            <v-card-text>
                <v-layout>
                    <v-flex>
                        <p class="text-xs-left">Aanmaakdatum: {{formatDate(report.creation)}}</p>
                        <p class="text-xs-left">Leerkracht: {{report.teacher.firstname}} {{report.teacher.lastname}}</p>
                    </v-flex>
                </v-layout>
            </v-card-text>
            <v-card-actions>
                <router-link :to="'/Rapport/' + report.id">
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
            reports: []
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
        const filters =  {
                studentid: this.userid
            }
        const listreports = await this.$http.paginateReports(
            undefined, undefined, filters
        );
        this.reports = listreports.items;
    },
    computed: {}
};
</script>
