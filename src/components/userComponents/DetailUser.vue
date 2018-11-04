<template>
    <v-container>
        <div class="text-xs-left">
            <h1 class="display-3">Details van gebruiker:</h1>
            <v-layout align-center justify-space-between row mb-5> 
                <h2 class="display-1">{{user.firstname}} {{user.lastname}}</h2>
                <v-btn v-if="user.status === 'ACTIVE'" color="error" class="ma-1 right" dark @click="deleteDialog = true"><v-icon dark>delete</v-icon></v-btn>
                <v-btn v-else class="ma-1 right light-green accent-4" dark @click="activateDialog = true">activeer</v-btn>
            </v-layout>
        </div>
        <v-form ref="form" lazy-validation mt-5>
            <v-layout align-center justify-space-between row fill-height> 
                <v-text-field
                    label="Voornaam"
                    v-model="user.firstname"
                    :rules="firstnameRules"
                    required
                    :readonly="fieldDisabled.name"
                ></v-text-field>
                <v-text-field
                    label="Naam"
                    v-model="user.lastname"
                    :rules="nameRules"
                    required
                    :readonly="fieldDisabled.name"
                ></v-text-field>
                <v-btn v-if="fieldDisabled.name" color="primary" class="ma-1 right" dark @click="fieldDisabled.name = !fieldDisabled.name"><v-icon dark>edit</v-icon></v-btn>
                <v-btn v-else class="ma-1 right light-green accent-4" dark @click="fieldDisabled.name = !fieldDisabled.name"><v-icon dark>save</v-icon></v-btn>
            </v-layout>
            <v-layout align-center justify-space-between row fill-height> 
                <v-text-field
                    label="E-mail"
                    v-model="user.email"
                    :rules="emailRules"
                    required
                    :readonly="fieldDisabled.email"
                    :disabled="fieldDisabled.email"
                ></v-text-field>
                <v-btn v-if="fieldDisabled.email" color="primary" class="ma-1 right" dark @click="fieldDisabled.email = !fieldDisabled.email"><v-icon dark>edit</v-icon></v-btn>
                <v-btn v-else class="ma-1 right light-green accent-4" dark @click="fieldDisabled.email = !fieldDisabled.email"><v-icon dark>save</v-icon></v-btn>
            </v-layout>
            <v-layout align-center justify-space-between row fill-height> 
                <v-select
                    label="Geslacht"
                    v-model="user.gender"
                    :rules="selectRules"
                    required
                    :items="constants.genders"
                    :disabled="fieldDisabled.select"
                ></v-select>
                <v-select
                    label="Rol"
                    v-model="user.role"
                    :rules="selectRules"
                    required
                    :items="constants.roles"
                    :disabled="fieldDisabled.select"
                ></v-select>
                <v-btn v-if="fieldDisabled.select" color="primary" class="ma-1 right" dark @click="fieldDisabled.select = !fieldDisabled.select"><v-icon dark>edit</v-icon></v-btn>
                <v-btn v-else class="ma-1 right light-green accent-4" dark @click="fieldDisabled.select = !fieldDisabled.select"><v-icon dark>save</v-icon></v-btn>
            </v-layout>
            <v-btn @click="updateUser" color="primary">Opslaan</v-btn>
            <div v-if="constants.roleKeys[user.role] === 'STUDENT'">
                <h3>Voeg een opleiding toe aan deze gebruiker:</h3>
                <v-layout align-center justify-space-between row fill-height>
                    <v-select
                        label="Opleiding"
                        v-model="opleiding"
                        :rules="selectRules"
                        required
                        :items="opleidingnames"
                        :disabled="fieldDisabled.opleiding"
                    ></v-select>
                    <v-btn v-if="fieldDisabled.opleiding" color="primary" class="ma-1 right" dark @click="fieldDisabled.opleiding = !fieldDisabled.opleiding"><v-icon dark>edit</v-icon></v-btn>
                    <v-btn v-else class="ma-1 right light-green accent-4" dark @click="fieldDisabled.opleiding = !fieldDisabled.opleiding"><v-icon dark>save</v-icon></v-btn>
                </v-layout>
                <v-btn @click="updateOpleiding" color="primary">Voeg opleiding toe</v-btn>
            </div>
        </v-form>
            <router-link to="/Gebruikers"><v-btn color="primary">Terug naar overzicht</v-btn></router-link>
        <v-dialog
      width="500"
      v-model="deleteDialog"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Opgelet!
        </v-card-title>

        <v-card-text>
          <p>U staat op het punt om <strong>{{ user.firstname + ' ' + user.lastname  }}</strong> te verwijderen.</p>
          <p>Bent u dit zeker?</p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            v-on:click="deleteDialog = false"
          >
            Annuleer
          </v-btn>
          <v-btn
            color="error"
            flat
            v-on:click="deleteUser(user.id)"
          >
            Bevestig
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      width="500"
      v-model="confirmDeleteDialog"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Verwijderd!
        </v-card-title>

        <v-card-text>
          <p><strong>{{ user.firstname + ' ' + user.lastname  }}</strong> is verwijderd.</p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            v-on:click="$router.push('/Gebruikers')"
          >
            Terug naar overzicht
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      width="500"
      v-model="activateDialog"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Opgelet!
        </v-card-title>

        <v-card-text>
          <p>U staat op het punt om <strong>{{ user.firstname + ' ' + user.lastname  }}</strong> te activeren.</p>
          <p>Bent u dit zeker?</p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            v-on:click="activateDialog = false"
          >
            Annuleer
          </v-btn>
          <v-btn
            color="error"
            flat
            v-on:click="activateUser(user.id)"
          >
            Bevestig
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-container>
</template>

<script>
import store from "../../store/index";
import { mapGetters } from "vuex";
export default {
  name: "DetailUser",
  data() {
    return {
      user: {},
      firstnameRules: [v => !!v || "Voornaam moet ingevuld worden"],
      nameRules: [v => !!v || "Naam moet ingevuld worden"],
      emailRules: [
        v => !!v || "E-mail moet ingevuld worden",
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail moet geldig zijn"
      ],
      selectRules: [v => !!v || "Veld moet ingevuld worden"],
      fieldDisabled: {
        name: true,
        email: true,
        select: true,
        opleiding: false
      },
      opleidingen: [],
      opleidingnames: [],
      opleiding: undefined,
      deleteDialog: false,
      confirmDeleteDialog: false,
      activateDialog: false
    };
  },
  methods: {
    async deleteUser(id) {
      console.log(`Gebruiker met id: ${id} wordt verwijderd`);
      await this.$http.deleteUser(id);
      this.deleteDialog = false;
      this.confirmDeleteDialog = true;
    },
    getKeyByValue(object, value) {
      return Object.keys(object).find(key => object[key] === value);
    },
    async updateUser() {
      // TODO do opleiding update
      this.user.gender = this.constants.genderKeys[this.user.gender];
      this.user.roles = [this.constants.roleKeys[this.user.role]];
      await this.$http.updateUser(this.user);
      this.user.gender = this.getKeyByValue(
        this.constants.genderKeys,
        this.user.gender
      );
      this.user.role = this.getKeyByValue(
        this.constants.roleKeys,
        this.user.roles[0]
      );
    },
    async activateUser(id) {
      await this.$http.activateUser(id);
      const user = await this.$http.getUser(id);
      user.gender = this.getKeyByValue(this.constants.genderKeys, user.gender);
      user.role = this.getKeyByValue(this.constants.roleKeys, user.role);
      this.user = user;
      this.activateDialog = false;
    },
    async updateOpleiding() {
      const selectedOpleiding = this.opleidingen.find(
        x => x.name === this.opleiding
      );
      if (!selectedOpleiding) {
        throw new Error("Deze opleiding bestaat niet.");
      }
      await this.$http.assignOpleidingToUser(selectedOpleiding.id, this.user.id);
    }
  },
  async created() {
    const userId = this.$route.params.id;
    const user = await this.$http.getUser(userId);
    user.gender = this.getKeyByValue(this.constants.genderKeys, user.gender);
    user.role = this.getKeyByValue(this.constants.roleKeys, user.role);
    this.user = user;
    if (this.user.role !== "ADMIN") {
      const opleidingen = await this.$http.getOpleidingen();
      const opleidingForUser = await this.$http.getOpleidingForStudent(userId);
      if (opleidingForUser) {
        this.opleiding = opleidingForUser.name;
        this.fieldDisabled.opleiding = true;
      }
      this.opleidingen = opleidingen;
      this.opleidingnames = this.opleidingen.map(opl => opl.name);
    }
  },
  computed: mapGetters(["constants"])
};
</script>
