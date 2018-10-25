<template>
  <div>
      <v-layout row wrap>
          <v-flex xs12 offset-xs1 class="text-xs-left">
            <h1 class="display-3">Gebruikers</h1>
          </v-flex>
      </v-layout>
      <v-layout row wrap>
          <v-flex xs4 offset-xs1 ref="results" @>
            <searchbar @select-item="applySelection" :list="gebruikers" :concat_keys="keys" :labeltext="zoeklabel" :item_concat_key="item_name" :item_value="item_value"></searchbar>
          </v-flex>
          <v-flex xs1 offset-xs4 class="mr-5">
          </v-flex>
          <v-speed-dial
            hover
            direction="left"
          >
            <v-btn
              slot="activator"
              color="blue darken-2"
              dark
              fab
              hover
              class="left"
            >
              <v-icon>add</v-icon>
            </v-btn>
            <v-btn
              fab
              dark
              small
              color="yellow"
              @click.stop="addStudentsFile = true"
            >
              <v-icon>file_upload</v-icon>
            </v-btn>
            <router-link to="AddStudent" style="text-decoration: none">
              <v-btn
                fab
                dark
                small
                color="red"
              >
                 <v-icon>person_add</v-icon>
              </v-btn>
            </router-link>
          </v-speed-dial>
      </v-layout>
      <v-layout row wrap>
          <v-flex class="mt-4" offset-xs1 xs2>
            <checkboxes :listobject="opleidingen" v-if="receivedData" @update-filters="applyFilters"></checkboxes>
          </v-flex>
          <v-flex class="mt-4" xs8>
            <v-data-table
            v-bind:headers="headers"
            :items="gebruikers"
            hide-actions
            class="elevation-1"
            >
              <template slot="items" slot-scope="gebruiker"><!-- .item must be here, don't ask questions -->
                <tr >
                <td class="text-xs-left">{{ gebruiker.item.firstname + ' ' + gebruiker.item.lastname  }}</td>
                <td class="text-xs-left">{{ gebruiker.item.opleidingsNaam }}</td>
                <td>
                    <a :href="'#/Evaluate?id=' + gebruiker.item.id" target="_blank"><v-btn color="primary" class="ma-1" dark>Evaluatie<v-icon dark right>assignment</v-icon></v-btn></a>
                    <router-link :to="{ path: 'Rapporten', query: { id: gebruiker.item.id, name: gebruiker.item.firstname + ' ' + gebruiker.item.lastname }}"><v-btn color="primary" class="ma-1" dark>rapport<v-icon dark right>import_contacts</v-icon></v-btn></router-link>
                    <router-link :to="{ path: 'Addstudent', query: { id: gebruiker.item.id }}"><v-btn color="primary" class="ma-1" dark><v-icon dark>edit</v-icon></v-btn></router-link>
                    <v-btn color="error" class="ma-1" dark @click="makeDialog(gebruiker.item)"><v-icon dark>delete</v-icon></v-btn>
                </td>
              </tr>
              </template>
            </v-data-table>
          </v-flex>
          <v-dialog v-model="addStudentsFile">
            <v-card>
              <v-card-title><span class="headline">Studenten toevoegen</span></v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12>
                      <fileInput v-model="filename" @formData="formData"></fileInput>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                  <v-btn color="primary" flat @click.stop="addStudentsFile=false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog
      width="500"
      v-model="dialogUser.show"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Opgelet!
        </v-card-title>

        <v-card-text>
          <p>U staat op het punt om <strong>{{ dialogUser.firstname + ' ' + dialogUser.lastname  }}</strong> te verwijderen.</p>
          <p>Bent u dit zeker?</p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            v-on:click="dialogUser.show = false"
          >
            Annuleer
          </v-btn>
          <v-btn
            color="error"
            flat
            v-on:click="deleteUser(dialogUser.userId)"
          >
            Bevestig
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
      </v-layout>
  </div>
</template>

<script>
import * as api from "../services/organizer-api";

function createStudentOpleidingMap(students, opleidingen) {
  return students.map(function(student) {
    const opleiding = opleidingen.find(x => x.id === student.opleidingId);
    student.opleidingsNaam =
      opleiding !== undefined ? opleiding.name : "Geen opleiding gevonden.";
    return student;
  });
}

export default {
  name: "Gebruikers",
  data() {
    return {
      filename: "",
      receivedData: false,
      formData: [],
      gebruikers: [],
      addStudentsFile: false,
      search: "",
      keys: ["firstname", "lastname"],
      zoeklabel: "gebruiker",
      filters: [],
      item_name: "fullname",
      item_value: "id",
      headers: [
        { text: "Student", align: "left", value: "student" },
        { text: "Opleiding", align: "left", value: "opleiding" },
        { text: "", value: "rapportid" }
      ],
      dialogUser: {
        firstname: "",
        lastname: "",
        userId: "",
        show: false
      }
    };
  },
  methods: {
    makeDialog(gebruiker) {
      this.dialogUser.firstname = gebruiker.firstname;
      this.dialogUser.lastname = gebruiker.lastname;
      this.dialogUser.userId = gebruiker.id;
      this.dialogUser.show = true;
    },
    uploadFiles() {
      const form = this.formData;
      console.log(form);
    },
    applyFilters(payload) {
      var self = this;
      payload.forEach(function(filter) {
        if (self.filters.includes(filter.opleiding)) {
          if (filter.value === true) {
            const index = self.filters.indexOf(filter.opleiding);
            self.filters.splice(index, 1);
          }
        } else if (filter.value === false) {
          self.filters.push(filter.opleiding);
        }
      });
    },
    applySelection(payload) {
      this.selectedid = payload;
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
    deleteUser(id) {
      console.log(`Gebruiker met id: ${id} wordt verwijderd`);
      this.dialogUser.firstname = "";
      this.dialogUser.lastname = "";
      this.dialogUser.userId = "";
      this.dialogUser.show = false;
    }
  },
  async created() {
    const gebruikers = await this.$http.getUsers();
    this.gebruikers = gebruikers;
    console.log(this.gebruikers);
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
