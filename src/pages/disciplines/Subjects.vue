<template>
<main>
    <v-layout row-wrap>
        <v-flex xs12 offset-xs1 class="text-xs-left">
            <h1 class="display-3">{{ 'Opleidingen' }}</h1>
        </v-flex>
    </v-layout>
    <template v-if="!editMode">
        <v-layout row-wrap>
            <v-flex xs4 offset-xs1>
                <searchbar @select-item="applySelection" :list="items" :concat_keys="keys" :labeltext="zoeklabel" :item_concat_key="item_name" :item_value="item_value"></searchbar>
            </v-flex>
            <v-flex xs1 offset-xs4 class="mr-5">
                <v-btn class="primary" @click="editMode=true">+ Nieuwe Opleiding</v-btn>
            </v-flex>
        </v-layout>
        <v-layout row-wrap>
            <v-flex class="mt-5" offset-xs1 xs10>
                <disciplineDataTable v-on:setMajor="setGivenMajor" v-on:dialogActivate="showDialogActivate" v-on:dialogDeactivate="showDialogDeactivate" :items="items"></disciplineDataTable>
            </v-flex>
        </v-layout>
    </template>
    <v-container>
        <subjecteditor v-if="editMode" :givenmajor="givenmajor"></subjecteditor>
    </v-container>
    <confirmdialog v-bind:model.sync="deactivateOpleidingStatus" v-on:confirm="deactivateOpleiding" :name="selectedOpleidingName" :action="'deactiveren'">
    </confirmdialog>
    <confirmdialog v-bind:model.sync="activateOpleidingStatus" v-on:confirm="activateOpleiding" :name="selectedOpleidingName" :action="'activeren'">
    </confirmdialog>
</main>
</template>

<script>
export default {
    name: "Subjects",
    data() {
        return {
            filename: "",
            formData: [],
            editMode: false,
            givenmajor: {
                id: null,
                name: null
            },
            addSubjectFile: false,
            items: [],
            filters: [],
            deactivateOpleidingStatus: false,
            activateOpleidingStatus: false,
            selectedOpleiding: null,
            selectedOpleidingen: null,
            selectedOpleidingName: null,
            selectedid: null,
            keys: ["name"],
            zoeklabel: "Opleiding",
            item_name: "name",
            item_value: "id"
        };
    },
    methods: {
        applySelection(payload) {
            this.selectedid = payload;
        },
        async deactivateOpleiding() {
            await this.$http.setOpleidingInactive(this.selectedOpleiding.id);
            this.deactivateOpleidingStatus = false;
            this.getOpleidingen();
            this.selectedOpleidingen = null;
            this.selectedOpleidingName = null;
            this.selectedOpleiding = null;
        },
        async activateOpleiding() {
            await this.$http.setOpleidingActive(this.selectedOpleiding.id);
            this.activateOpleidingStatus = false;
            this.getOpleidingen();
            this.selectedOpleidingen = null;
            this.selectedOpleidingName = null;
            this.selectedOpleiding = null;
        },
        checkSelected(id) {
            if (this.selectedid === null) {
                return true;
            } else if (this.selectedid === id) {
                return true;
            } else {
                return false;
            }
        },
        async getOpleidingen() {
            this.items = await this.$http.getOpleidingen();
        },
        showDialogActivate(opleidingen, opleiding) {
            this.activateOpleidingStatus = true;
            this.setSelectedOpleiding(opleidingen, opleiding);
        },
        showDialogDeactivate(opleidingen, opleiding) {
            this.deactivateOpleidingStatus = true;
            this.setSelectedOpleiding(opleidingen, opleiding);
        },
        setSelectedOpleiding(opleidingen, opleiding) {
            this.selectedOpleidingen = opleidingen;
            this.selectedOpleiding = opleiding;
            this.selectedOpleidingName = opleiding.name;
        },
        setGivenMajor(major) {
            this.givenmajor = major;
            this.editMode = true;
        },
    },
    async created() {
        var self = this;
        const opleidingen = await this.$http.getOpleidingen();
        this.items = opleidingen;
    },
    mounted() {
        var sheet = document.createElement("style");
        sheet.innerHTML = "div.menu__content--autocomplete {top:165px !important;}";
        document.body.appendChild(sheet);
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
</style>
