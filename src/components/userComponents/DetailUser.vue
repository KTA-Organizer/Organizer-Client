<template>
    <v-container>
        <div class="text-xs-left">
            <h1 class="display-3">Details van gebruiker:</h1>
            <v-layout align-center justify-space-between row mb-5> 
                <h2 class="display-1">{{user.firstname}} {{user.lastname}}</h2>
                <v-btn color="error" class="ma-1 right" dark><v-icon dark>delete</v-icon></v-btn>
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
                    :disabled="true"
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
            <v-layout align-center justify-space-between row fill-height> 
                
            </v-layout>
            <div>
                <h3>Voeg een opleiding to aan deze gebruiker:</h3>
                <v-layout v-if="user.role !== 'ADMIN'" align-center justify-space-between row fill-height>
                    <v-select
                        label="Opleiding"
                        v-model="opleiding"
                        :rules="selectRules"
                        required
                        :items="opleidingnames"
                    ></v-select>
                </v-layout>
            </div>

            <v-btn color="primary">Opslaan</v-btn>
        </v-form>
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
        select: true
      },
      opleidingen: [],
      opleidingnames: [],
      opleiding: undefined,
    };
  },
  methods: {
    getKeyByValue(object, value) {
      return Object.keys(object).find(key => object[key] === value);
    }
  },
  async created() {
    console.log(this.constants);
    const userId = this.$route.params.id;
    const user = await this.$http.getUser(userId);
    user.gender = this.getKeyByValue(this.constants.genderKeys, user.gender);
    user.role = this.getKeyByValue(this.constants.roleKeys, user.role);
    this.user = user;
    if (this.user.role !== "ADMIN") {
      const opleidingen = await this.$http.getOpleidingen();
      this.opleidingen = opleidingen;
      this.opleidingnames = [];
      for (const opleiding of opleidingen) {
        console.log(opleiding.name);
        this.opleidingnames.push(opleiding.name);
      }
    }
  },
  computed: mapGetters(["constants"])
};
</script>
