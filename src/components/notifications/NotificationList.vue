<template>
    <div>
        <v-expansion-panel popout>
            <v-expansion-panel-content v-for="melding in meldingen" :key="melding.id">
                <div slot="header" :active="true">
                    <h2>{{melding.titel}}</h2>
                    <small>geplaatst door {{melding.creator.firstname}} {{melding.creator.lastname}} {{melding.datum}}</small>
                </div>
                <v-card>
                    <v-card-text v-html="melding.tekst"></v-card-text>
                    <v-card-actions v-if="melding.creator.id === currentUserId">
                        <v-btn class="red" dark v-on:click="$emit('delete', melding.id)"><i class="material-icons">delete</i></v-btn>
                    </v-card-actions>
                </v-card>
            </v-expansion-panel-content>
        </v-expansion-panel>   
    </div> 
</template>

<script>
export default {
    name: "Notification",
    props: ["meldingen", "currentUserId"]
}
</script>

<style scoped>
>>>img{
    max-width: 100%;
}
</style>
