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
              <v-btn color="error" v-if="props.item.active" class="ma-1 right" dark @click="showDialogDeactivate(props, props.item)"><v-icon dark>delete</v-icon>Deactiveer</v-btn>
              <v-btn color="error" v-if="!props.item.active" class="ma-1 right" dark @click="showDialogActivate(props, props.item)"><v-icon dark>build</v-icon>Activeer</v-btn>
              <v-btn color="primary" class="ma-1 right" @click.native="setGivenMajor(props.item)" dark><v-icon dark>edit</v-icon></v-btn>
            </td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <v-dialog width="500" v-model="deactivateOpleidingStatus">
                <v-card>
                  <v-card-title class="headline grey lighten-2" primary-title>
                    Opgelet!
                  </v-card-title>

                  <v-card-text>
                    <p>U staat op het punt om <strong>{{ selectedOpleidingName }}</strong> te deactiveren.</p>
                    <p>Bent u dit zeker?</p>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat v-on:click="deactivateOpleidingStatus = false">
                      Annuleer
                    </v-btn>
                    <v-btn color="error" flat v-on:click="deactivateOpleiding()">
                      Bevestig
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
      <v-dialog width="500" v-model="activateOpleidingStatus">
                <v-card>
                  <v-card-title class="headline grey lighten-2" primary-title>
                    Opgelet!
                  </v-card-title>

                  <v-card-text>
                    <p>U staat op het punt om <strong>{{ selectedOpleidingName }}</strong> te activeren.</p>
                    <p>Bent u dit zeker?</p>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat v-on:click="activateOpleidingStatus = false">
                      Annuleer
                    </v-btn>
                    <v-btn color="error" flat v-on:click="activateOpleiding()">
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
    uploadFiles() {
      const form = this.formData;
      console.log(form);
    },
    showDialogDeactivate(opleidingen, opleiding){
      this.deactivateOpleidingStatus = true;
      this.selectedOpleidingen = opleidingen;
      this.selectedOpleiding = opleiding;
      this.selectedOpleidingName = opleiding.name;
    },
    showDialogActivate(opleidingen, opleiding){
      this.activateOpleidingStatus = true;
      this.selectedOpleidingen = opleidingen;
      this.selectedOpleiding = opleiding;
      this.selectedOpleidingName = opleiding.name;
    },
    setGivenMajor(major) {
      this.givenmajor = major;
      this.editMode = true;
    },
    async deactivateOpleiding(){
      await this.$http.setOpleidingInactive(this.selectedOpleiding.id);
      this.deactivateOpleidingStatus = false;
      this.getOpleidingen();
    }
    ,
    async activateOpleiding(){
      await this.$http.setOpleidingActive(this.selectedOpleiding.id);
      this.activateOpleidingStatus = false;
      this.getOpleidingen();
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
    async getOpleidingen(){
      this.items = await this.$http.getOpleidingen();
    }
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
