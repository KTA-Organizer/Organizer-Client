<template>
    <v-layout row wrap>
        <v-flex xs12 offset-xs1 class="text-xs-left">
            <h1 class="display-3">Meldingen</h1>
        </v-flex>
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
                <v-btn color="primary" :disabled="!valid" @click="submit">Voeg toe</v-btn>
        </v-form>
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
      opleidingen: []
    };
  },
  methods: {
    async submit() {
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
