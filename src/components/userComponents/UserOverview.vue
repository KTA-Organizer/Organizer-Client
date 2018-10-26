<template>
  <div>
      <v-layout row wrap>
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
            <v-btn
              fab
              dark
              small
              color="yellow"
              @click.stop="addStudentsFile = true"
            >
              <v-icon>file_upload</v-icon>
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
      filename: "",
      receivedData: false,
      formData: [],
      gebruikers: [],
      filteredGebruikers: [],
      addStudentsFile: false,
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
      dialogUser: {
        firstname: "",
        lastname: "",
        userId: "",
        show: false
      },
      nameFilter: "",
      roleFilter: "",
      genderFilter: "",
      statusFilter: "Actief",
      roleKeys: {
        "Geen filter": false,
        Administrator: "ADMIN",
        Student: "STUDENT",
        Leerkracht: "TEACHER",
        "Geen rol toegekent": "#"
      },
      roles: [
        "Geen filter",
        "Administrator",
        "Student",
        "Leerkracht",
        "Geen rol toegekent"
      ],
      genders: ["Geen filter", "Man", "Vrouw"],
      genderKeys: {
        "Geen filter": false,
        Man: "M",
        Vrouw: "F"
      },
      statusses: ["Geen filter", "Actief", "Wacht op activatie", "Niet actief"],
      statusKeys: {
        "Geen filter": false,
        Actief: "ACTIVE",
        "Wacht op activatie": "WAIT_ACTIVATION",
        "Niet actief": "DISABLED"
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
    applyFilters() {
      const naamFiltertje = this.nameFilter.toLowerCase();
      const rolFiltertje = this.roleKeys[this.roleFilter]
        ? this.roleKeys[this.roleFilter].toLowerCase()
        : false;
      const genderFiltertje = this.genderKeys[this.genderFilter];
      const statusFiltertje = this.statusKeys[this.statusFilter];
      console.log(naamFiltertje, rolFiltertje, genderFiltertje, statusFiltertje);
      console.log(this.gebruikers)
      this.filteredGebruikers = this.gebruikers
        .filter(x => {
          if (!genderFiltertje) {
            return true;
          }
          return x.gender === genderFiltertje;
        })
        .filter(x => {
          if (!rolFiltertje) {
            return true;
          }
          const roleToCheck = x.role ? x.role : "#";
          return roleToCheck.toLowerCase() === rolFiltertje;
        })
        .filter(x => {
          return `${x.firstname} ${x.lastname}`
            .toLowerCase()
            .includes(naamFiltertje);
        })
        .filter(x => {
          if (!statusFiltertje) {
            return true;
          }
          return x.status === statusFiltertje;
        });
    },
    deleteUser(id) {
      console.log(`Gebruiker met id: ${id} wordt verwijderd`);
      this.dialogUser.firstname = "";
      this.dialogUser.lastname = "";
      this.dialogUser.userId = "";
      this.dialogUser.show = false;
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
      return `${day}/${month}/${year}, ${+hour+2}:${minutes}`;
    },
    getKeyByValue(object, value) {
      return Object.keys(object).find(key => object[key] === value);
    }
  },
  async created() {
    const gebruikers = await this.$http.getUsers();
    console.log(gebruikers)
    this.gebruikers = gebruikers;
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
