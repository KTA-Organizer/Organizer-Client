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
        <v-data-table
          v-bind:headers="headers"
          :items="items"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <tr v-if="checkSelected(props.item.id)">
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-right">
              <v-btn color="error" class="ma-1 right" dark @click="showDialog(props, props.item.name, props.item.id)"><v-icon dark>delete</v-icon>Deactiveer</v-btn>
              <v-btn color="primary" class="ma-1 right" @click.native="setGivenMajor(props.item)" dark><v-icon dark>edit</v-icon></v-btn>
            </td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <v-dialog width="500" v-model="deleteOpleiding">
                <v-card>
                  <v-card-title class="headline grey lighten-2" primary-title>
                    Opgelet!
                  </v-card-title>

                  <v-card-text>
                    <p>U staat op het punt om <strong>{{ selectedOpleidingName }}</strong> te verwijderen.</p>
                    <p>Bent u dit zeker?</p>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat v-on:click="deleteOpleiding = false">
                      Annuleer
                    </v-btn>
                    <v-btn color="error" flat v-on:click="deactivateOpleiding()">
                      Bevestig
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
  </template>
  <v-container>
    <subjecteditor v-if="editMode" :givenmajor="givenmajor" ></subjecteditor>
  </v-container>
  </main>
</template>

<script>
import * as api from "../services/organizer-api";
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
      headers: [
        { text: "Opleiding", align: "left", value: "opleiding" },
        { text: "", value: "actionbtns" }
      ],
      items: [],
      filters: [],
      deleteOpleiding: false,
      selectedOpleidingName: null,
      selectedOpleidingId: null,
      selectedOpleidingen: null,
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
    uploadFiles() {
      const form = this.formData;
      console.log(form);
    },
    showDialog(opleidingen, opleidingName, opleidingId){
      this.deleteOpleiding = true;
      this.selectedOpleidingen = opleidingen;
      this.selectedOpleidingName = opleidingName;
      this.selectedOpleidingId = opleidingId;
    },
    setGivenMajor(major) {
      this.givenmajor = major;
      this.editMode = true;
    },
    deactivateOpleiding(){
      console.log(this.selectedOpleidingen);
      console.log(this.selectedOpleidingName);
      console.log(this.selectedOpleidingId);
      api.setOpleidingInactive(this.selectedOpleidingId);
      this.deleteOpleiding = false;
      this.selectedOpleidingen = null;
      this.selectedOpleidingName = null;
      this.selectedOpleidingId = null;
    }
    ,
    checkSelected(id) {
      if (this.selectedid === null) {
        return true;
      } else if (this.selectedid === id) {
        return true;
      } else {
        return false;
      }
    }
  },
  async created() {
    var self = this;
    const opleidingen = await api.getOpleidingen();
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
