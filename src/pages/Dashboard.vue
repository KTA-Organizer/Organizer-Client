<template>
<v-layout column>
    <v-layout justify-center>
        <v-flex md6 v-if="!isStudent">
            <v-card>
                <v-card-text>
                    <h1>Welkom {{currentUser.firstname}}</h1>
                    <p v-if="isTeacher">Op dit platform kan je terecht voor meerdere zaken. De inhoud van alle actieve opleidingen kunnen volledig getoond worden. Daarnaast kunnen evaluaties gemaakt worden en ingevuld worden voor de studenten. Op basis van deze evaluaties kunnen de rapporten gegenereerd worden en vervolgens bekeken, geprint of gedownload worden.</p>
                    <p v-if="isAdmin">Als admin kan je alles beheren. De inhoud van alle actieve opleidingen kunnen volledig aangepast worden. Daarnaast kunnen evaluaties gemaakt worden en ingevuld worden voor de studenten. Op basis van deze evaluaties kunnen de rapporten gegenereerd worden en vervolgens bekeken, geprint of gedownload worden. Daarnaast kun je meldingen aanmaken voor de andere admins en leerkrachten. Ten slotte kunnen alle gebruikers beheerd worden.</p>
                    <p v-if="isTeacher || isStudent">Bij problemen, contacteer de helpdesk.</p>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-flex xs6 v-else>
            <v-card>
                <v-card-text>
                    <h1>Welkom {{currentUser.firstname}}</h1>
                    <p v-if="isStudent">Op dit platform kan je terecht voor het bekijken van je rapporten. Bij een nieuw rapport, zul je deze hier kunnen bekijken, printen of downloaden. Bij een nieuw rapport krijg je een e-mail.</p>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-flex column xs12 md6 v-if="!isStudent">
            <v-card>
                <v-layout reverse row>
                    <v-btn v-if="isAdmin" to="/melding/toevoegen" dark hover color="primary">
                        <v-icon>add</v-icon>&nbsp;
                        melding maken
                    </v-btn>
                </v-layout>
                <v-flex>
                    <notification v-on:delete="deleteMelding" :meldingen="meldingen" :currentUserId="currentUser.id"></notification>
                </v-flex>
            </v-card>
        </v-flex>
    </v-layout>
    <v-layout justify-center v-if="isStudent">
        <v-flex xs3 v-for="report in studentReports" :key="report.id">
            <v-card>
                <v-card-title>
                    <h3>Module: {{report.module.name}}</h3>
                </v-card-title>
                <v-card-text style="text-align: left">
                    <p>Opleiding: {{report.discipline.name}}</p>
                    <p>Datum: {{report.creation}}</p>
                    <p>Leerkracht: {{report.teacher.firstname + " " + report.teacher.lastname}}</p>
                </v-card-text>
                <v-card-actions>
                    <v-btn :to="'/rapport/'+report.id" dark hover color="primary">
                        bekijken
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>

</v-layout>
</template>

<script>
import moment from "moment";
import {
    mapGetters
} from 'vuex';

export default {
    name: "dashboard",
    data() {
        return {
            studentReports: [],
            meldingen: [],
        };
    },
    computed: {
        ...mapGetters(["currentUser", "isTeacher", "isAdmin", "isStudent"]),
    },
    async created() {
        if (this.isStudent) {
            const result = await this.$http.paginateReports(1, 1e9, {
                studentid: this.currentUser.id
            });
            this.studentReports = result.items.map(report => Object.assign(report, {
                creation: moment(report.creation).format("DD-MM-YYYY")
            }))
        } else {
            const meldingen = await this.$http.getMeldingen();
            this.meldingen = meldingen.map(m => Object.assign(m, {
                datum: moment(m.datum).fromNow()
            }))
        }
    },
    methods: {
        async deleteMelding(id) {
            await this.$http.removeMelding(id);
            this.meldingen = this.meldingen.filter(m => m.id !== id);
        }
    }
};
</script>

<style>
</style>
