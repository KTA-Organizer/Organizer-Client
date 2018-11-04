<template>
<v-layout row justify-center>
  <v-flex md6>
    <v-stepper v-model="stepper">
      <v-stepper-items>
        <v-stepper-header>
          <v-stepper-step step="1" :complete="stepper > 1">Melding aanmaken</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="2" :complete="stepper > 2">Voltooid</v-stepper-step>
        </v-stepper-header>
        <v-stepper-content step="1">
          <v-form v-model="valid" ref="form" lazy-validation>
            <v-text-field label="Titel" v-model="titel" :rules="titelRules" required :autofocus="true"></v-text-field>
            <v-select label="Opleidingen" v-model="select" :items="opleidingen" name="opleiding" item-text="name" item-value="select" :rules="[v => !!v || 'Een opleiding moet geselecteerd worden']" required :multiple="true"></v-select>
            <vue-editor v-model="tekst" :editorToolbar="editorToolbar"></vue-editor>
            <v-btn v-if="!adding" color="primary" :disabled="!valid" @click="submit">Voeg toe</v-btn>
            <v-progress-circular v-else color="primary" :indeterminate="true"></v-progress-circular>
          </v-form>
        </v-stepper-content>
        <v-stepper-content step="2">
          <h5>De melding is succesvol toegevoegd.</h5>
          <p>Leerlingen ingeschreven in de geselecteerde opleidingen zullen op
            de hoogte gebracht worden via mail en in het tabblad meldingen</p>
          <router-link to="/meldingen">
            <v-btn color="primary">Terug naar meldingen</v-btn>
          </router-link>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-flex>
</v-layout>
</template>

<script>
import {
  VueEditor
} from 'vue2-editor'

export default {
  name: "addMelding",
  components: {
    VueEditor
  },
  data() {
    return {
      titel: "",
      titelRules: [v => !!v || "Titel moet ingevuld worden"],
      tekst: "",
      editorToolbar: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons

        [{
          'header': 1
        }, {
          'header': 2
        }], // custom button values
        [{
          'list': 'ordered'
        }, {
          'list': 'bullet'
        }],
        [{
          'indent': '-1'
        }, {
          'indent': '+1'
        }], // outdent/indent

        [{
          'align': []
        }],
      ],
      valid: true,
      select: "",
      opleidingen: [],
      stepper: 0,
      adding: false,
    };
  },
  methods: {
    async submit() {
      this.adding = true;
      const meldingObj = {
        titel: this.titel,
        tekst: this.tekst,
        opleidingIds: this.opleidingen
          .filter(opl => this.select.indexOf(opl.name) > -1)
          .map(opl => opl.id)
      };
      await this.$http.createMelding(meldingObj);
      this.valid = false;
      this.stepper = 2;
    }
  },
  async created() {
    this.opleidingen = await this.$http.getOpleidingen();
  }
};
</script>
