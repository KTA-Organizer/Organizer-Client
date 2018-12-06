<template>
<v-data-table v-bind:headers="headers" :items="items" hide-actions class="elevation-1">
    <template slot="items" slot-scope="props">
        <tr v-if="(isTeacher && props.item.active) || isAdmin">
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-right">
                <div v-if="isAdmin">
                    <v-btn round color="error" v-if="props.item.active" class="ma-1 right fixWidth" dark @click="$emit('dialogDeactivate', props, props.item)">
                        <v-icon dark>delete</v-icon>&nbsp; Deactiveer
                    </v-btn>
                    <v-btn round color="success" v-if="!props.item.active" class="ma-1 right fixWidth" dark @click="$emit('dialogActivate', props, props.item)">
                        <v-icon dark>build</v-icon>&nbsp;&nbsp;&nbsp;&nbsp; Activeer
                    </v-btn>
                </div>
                <v-btn round color="primary" class="ma-1 right" dark :to="{ name: 'Opleiding', params: { disciplineid: props.item.id }}">
                    <v-icon dark>remove_red_eye</v-icon>&nbsp; Bekijken
                </v-btn>
            </td>
        </tr>
    </template>
</v-data-table>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: "DisciplineDataTable",
    props: ["items", "value"],
    data() {
        return {
            headers: [{
                    text: "Opleiding",
                    align: "left",
                    value: "opleiding"
                },
                {
                    text: "",
                    value: "actionbtns"
                }
            ],
        };
    },
    computed: mapGetters(["isAdmin", "isTeacher"]),
    methods: {
    }
};
</script>

<style>
.fixWidth {
    width: 145px;
}
</style>
