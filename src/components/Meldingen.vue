<template>
<div>
      <v-layout row wrap>
          <v-flex xs12 offset-xs1 class="text-xs-left">
            <h1 class="display-3">Meldingen</h1>
          </v-flex>
      </v-layout>
    <v-layout row wrap>
          <v-flex xs1 offset-xs4 class="mr-5">
          </v-flex>
            <router-link to="AddMelding" style="text-decoration: none">
              <v-btn
                fab
                dark
                hover
                color="blue darken-2"
              >
                 <v-icon>add</v-icon>
              </v-btn>
            </router-link>
      </v-layout>
    <v-layout>
        <v-flex>
            <v-expansion-panel popout>
                <v-expansion-panel-content
                    v-for="melding in meldingen"
                    :key="melding.id"
                >
                <div slot="header" :active="true">
                    <!-- <i class="material-icons">sms_failed</i> -->
                    <h2>{{melding.titel}}</h2>
                    <small>(geplaatst door {{melding.teacher.firstname}} {{melding.teacher.lastname}} op {{melding.datum}})</small>
                </div>
                <v-card>
                    <v-card-text>{{melding.tekst}}</v-card-text>
                    <v-card-actions>
                        <v-btn class="red" dark v-on:click="deleteMelding(melding.id)"><i class="material-icons">delete</i></v-btn>
                    </v-card-actions>
                </v-card>
            </v-expansion-panel-content>
            </v-expansion-panel>
        </v-flex>
    </v-layout>

</div>
</template>
<script>
"use strict";
export default {
  name: "meldingen",
  data() {
    return {
      meldingen: []
    };
  },
  async created() {
    this.meldingen = await this.$http.getMeldingen();
  },
  methods: {
    async deleteMelding(id) {
      await this.$http.removeMelding(id);
      this.meldingen = this.meldingen.filter(m => m.id !== id);
    }
  }
};
</script>

