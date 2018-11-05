<template>
  <div>
      <v-layout row wrap>
        <v-flex xs11 sm8 md10 class="text-xs-left">
            <h1 class="display-3">Overzicht van gebruikers</h1>
        </v-flex>
          <v-flex :align-end="true">
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
            <router-link to="Gebruikers/Toevoegen" style="text-decoration: none">
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
          </v-flex>
      </v-layout>
      <v-layout row wrap>
      <v-layout row wrap>
          <v-flex xs12 sm6 md3>
              <v-text-field autofocus="autofocus" type="text" placeholder="Filter op naam" v-model="nameFilter" v-on:input="applyFilters()"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md3>    
              <v-select
                :items="roles"
                v-model="roleFilter"
                label="Filter op rol"
                v-on:input="applyFilters()"
              ></v-select>
          </v-flex>
          <v-flex xs12 sm6 md3>
              <v-select
                :items="genders"
                v-model="genderFilter"
                label="Filter op geslacht"
                v-on:input="applyFilters()"
              ></v-select>
          </v-flex>
            <v-flex xs12 sm6 md3>  
              <v-select
                v-model="statusFilter"
                label="Filter op status"
                :items="statusses"
                v-on:input="applyFilters()"
              >
              </v-select>
          </v-flex>
          </v-layout>
          <v-flex xs1 offset-xs4 class="mr-5">
          </v-flex>
      </v-layout>
      <v-layout row wrap>
        
          <userdetail :headers="headers" :users="filteredGebruikers"></userdetail>

      </v-layout>
  </div>
</template>

<script>
import * as constants from "../../constants/user";

function createStudentOpleidingMap(students, opleidingen) {
  return students.map(function(student) {
    const opleiding = opleidingen.find(x => x.id === student.opleidingId);
    student.opleidingsNaam =
      opleiding !== undefined ? opleiding.name : "Geen opleiding gevonden.";
    return student;
  });
}

function addLeadingZero(numberToFormat) {
  return (numberToFormat =
    numberToFormat < 10 ? "0" + numberToFormat : numberToFormat);
}

export default {
  name: "Gebruikers",
  data() {
    return {
      receivedData: false,
      formData: [],
      gebruikers: [],
      filteredGebruikers: [],
      search: "",
      keys: ["firstname", "lastname"],
      zoeklabel: "gebruiker",
      filters: [],
      item_name: "fullname",
      item_value: "id",
      headers: [
        { text: "Naam", align: "left", value: "naam", sortable: true },
        { text: "Rol", align: "left", value: "role", sortable: true },
        { text: "Email", align: "left", value: "email", sortable: true },
        { text: "Geslacht", align: "left", value: "gender", sortable: true },
        { text: "Status", align: "left", value: "status", sortable: true },
        { text: "Datum aangemaakt", value: "accountCreatedTimestamp" }
      ],
      nameFilter: "",
      roleFilter: "",
      genderFilter: "",
      statusFilter: "Actief",
      roleKeys: constants.roleKeys,
      roles: constants.roles,
      genders: constants.genders,
      genderKeys: constants.genderKeys,
      statusses: constants.statusses,
      statusKeys: constants.statusKeys,
    };
  },
  methods: {
    applyFilters() {
      const naamFiltertje = this.nameFilter.toLowerCase();
      const rolFiltertje = this.roleKeys[this.roleFilter]
        ? this.roleKeys[this.roleFilter].toUpperCase()
        : false;
      const genderFiltertje = this.genderKeys[this.genderFilter];
      const statusFiltertje = this.statusKeys[this.statusFilter];
      this.filteredGebruikers = this.gebruikers;

      if (statusFiltertje) {
        this.filteredGebruikers = this.filteredGebruikers.filter(
          x => x.status === statusFiltertje
        );
      }
      if (genderFiltertje) {
        this.filteredGebruikers = this.filteredGebruikers.filter(
          x => x.gender === genderFiltertje
        );
      }
      if (rolFiltertje) {
        this.filteredGebruikers = this.filteredGebruikers.filter(
          x =>
            rolFiltertje === "#"
              ? x.roles.length === 0
              : x.roles.indexOf(rolFiltertje) > -1
        );
      }
      if (naamFiltertje) {
        this.filteredGebruikers = this.filteredGebruikers.filter(x =>
          `${x.firstname} ${x.lastname}`.toLowerCase().includes(naamFiltertje)
        );
      }
    },
    readableDate(timeStamp) {
      const stamp = timeStamp.split("T");
      const date = stamp[0].split("-");
      const time = stamp[1].split(":");
      let day = date[2];
      let month = date[1];
      const year = date[0];
      let hour = time[0];
      let minutes = time[1];
      return `${day}/${month}/${year}, ${+hour + 2}:${minutes}`;
    },
    getKeyByValue(object, value) {
      return Object.keys(object).find(key => object[key] === value);
    }
  },
  async created() {
    const gebruikers = await this.$http.paginateUsers({
      page: 1,
      perPage: 10000
    });
    this.gebruikers = gebruikers.items;
    for (const gebruiker of this.gebruikers) {
      gebruiker.naam = `${gebruiker.firstname} ${gebruiker.lastname}`;
    }
    this.filteredGebruikers = this.gebruikers;
    this.applyFilters();
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
