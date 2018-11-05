<template>
<v-data-table v-bind:headers="headers" :items="items" hide-actions class="elevation-1">
    <template slot="items" slot-scope="props">
        <tr v-if="checkSelected(props.item.id)">
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-right">
                <v-btn color="error" v-if="props.item.active" class="ma-1 right" dark @click="showDialogDeactivate(props, props.item)">
                    <v-icon dark>delete</v-icon> Deactiveer
                </v-btn>
                <v-btn color="error" v-if="!props.item.active" class="ma-1 right" dark @click="showDialogActivate(props, props.item)">
                    <v-icon dark>build</v-icon> Activeer
                </v-btn>
                <v-btn color="primary" class="ma-1 right" @click.native="setGivenMajor(props.item)" dark>
                    <v-icon dark>edit</v-icon>
                </v-btn>
            </td>
        </tr>
    </template>
</v-data-table>
</template>

          

<script>
export default {
    name: "DisciplineDataTable",
    props: ["items", "headers", "value"],
    data() {
        return {
            selectedid: null,
            x: this.value
        };
    },
    methods: {
        checkSelected(id) {
            if (this.selectedid === null) {
                return true;
            } else if (this.selectedid === id) {
                return true;
            } else {
                return false;
            }
        },
        showDialogDeactivate(opleidingen, opleiding) {
            this.$parent.$data.deactivateOpleidingStatus = true;
            this.$parent.$data.selectedOpleidingen = opleidingen;
            this.$parent.$data.selectedOpleiding = opleiding;
            this.$parent.$data.selectedOpleidingName = opleiding.name;
        },
        showDialogActivate(opleidingen, opleiding) {
            this.$parent.$data.activateOpleidingStatus = true;
            this.$parent.$data.selectedOpleidingen = opleidingen;
            this.$parent.$data.selectedOpleiding = opleiding;
            this.$parent.$data.selectedOpleidingName = opleiding.name;
        },
        setGivenMajor(major) {
            this.$parent.$data.givenmajor = major;
            this.$parent.$data.editMode = true;
        },
    }
};
</script>
