<template>
    <v-card>
    <v-card-title>
        <v-layout align-center justify-space-between row>
            <h1>Evaluaties</h1>
        </v-layout>
    </v-card-title>
    <v-card-text>
        <p>evaluatie ==> userid: {{userid}}</p>
        <v-layout v-for="evaluation in evaluations" v-bind:key="evaluation.id">
            <p>{{evaluation}}</p>
        </v-layout>
    </v-card-text>
</v-card>
</template>

<script>
export default {
    name: "ListForUser",
    props: ["userid"],
    data() {
        return {
            evaluations: []
        }
    },
    methods: {
        
    },
    async created() {
        this.evaluations = await this.$http.getEvalsForStudent(this.userid);
    }    
}
</script>
