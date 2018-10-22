<template>
    <v-layout row wrap>
        <v-flex xs12 offset-xs1 class="text-xs-left">
            <h1 class="display-3">Meldingen</h1>
        </v-flex>
        <v-stepper v-model="stepper">
            <v-stepper-header>
                <v-stepper-step step="1" :complete="stepper > 1">Melding aanmaken</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="2" :complete="stepper > 2">Voltooid</v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
                <v-stepper-content step="1">
                    <v-form v-model="valid" ref="form" lazy-validation>
                        <v-text-field
                        label="Titel"
                        v-model="titel"
                        :rules="titelRules"
                        required
                        :autofocus="true"
                        ></v-text-field>
                        <v-textarea
                        label="Tekst"
                        v-model="tekst"
                        :rules="tekstRules"
                        required
                        ></v-textarea>
                        <v-select
                        label="Opleiding"
                        v-model="select"
                        :items="opleidingen"
                        name="opleiding"
                        item-text="name"
                        item-value="select"
                        :rules="[v => !!v || 'Een opleiding moet geselecteerd worden']"
                        required
                        :multiple="true"
                        ></v-select>
                        <v-btn v-if="!adding" color="primary" :disabled="!valid" @click="submit">Voeg toe</v-btn>
                        <v-progress-circular v-else color="primary" :indeterminate="true"></v-progress-circular>
                    </v-form>
                </v-stepper-content>
                <v-stepper-content step="2">
                    <h5>De melding is succesvol toegevoegd.</h5>
                    <p>Leerlingen ingeschreven in de geselecteerde opleidingen zullen op 
                        de hoogte gebracht worden via mail en in het tabblad meldingen</p>
                    <router-link to="/meldingen"><v-btn color="primary">Terug naar meldingen</v-btn></router-link>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </v-layout>
</template>

<script>
export default {
  name: "addMelding",
  data() {
    return {
      titel: "",
      titelRules: [v => !!v || "Titel moet ingevuld worden"],
      tekst: "",
      tekstRules: [v => !!v || "Tekst moet ingevuld worden"],
      valid: true,
      select: "",
      opleidingen: [],
      stepper: 0,
      adding: false
    };
  },
  methods: {
    async submit() {
      this.adding = true;
      const meldingObj = {};
      meldingObj.titel = this.titel;
      meldingObj.tekst = this.tekst;
      const selectedOpleidingen = this.opleidingen.reduce((acc, current) => {
        if (this.select.indexOf(current.name) >= 0) {
          acc.push(current.id);
        }
        return acc;
      }, []);
      meldingObj.opleidingIds = selectedOpleidingen;
      await this.$http.createMelding(meldingObj);
      this.valid = false;
      this.stepper = 2;
    }
  },
  async created() {
    const opleidingen = await this.$http.getOpleidingen();
    this.opleidingen = opleidingen;
    this.opleidingen = this.opleidingen.reduce((acc, current) => {
      acc.push({ id: current.id, name: current.name });
      return acc;
    }, []);
  }
};
</script>
