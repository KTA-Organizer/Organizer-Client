<template>
<v-layout row>
  <v-flex column xs12 md6>
    <v-card>
      <v-card-text>
        <h1>Welkom {{currentUser.firstname}}</h1>
        <p>Cras condimentum aliquam nibh, quis tincidunt felis feugiat at. Cras eget luctus est. Praesent bibendum enim ipsum, ac laoreet justo fringilla vitae. Mauris dignissim nulla turpis, a cursus metus rhoncus finibus. Donec eleifend feugiat ante, id pellentesque odio maximus ac. Donec sodales vulputate sapien, non tristique ligula mattis nec. Maecenas rutrum, felis ac venenatis efficitur, nulla ante hendrerit felis, ut ultrices lectus ipsum in eros. Curabitur eleifend tincidunt arcu quis congue. Etiam nisl mi, interdum a luctus nec, ornare non massa.</p>
      </v-card-text>
    </v-card>
    <!-- <v-card>
      <v-card-text>
        <h1>Welkom {{currentUser.firstname}}</h1>
        <p>Cras condimentum aliquam nibh, quis tincidunt felis feugiat at. Cras eget luctus est. Praesent bibendum enim ipsum, ac laoreet justo fringilla vitae. Mauris dignissim nulla turpis, a cursus metus rhoncus finibus. Donec eleifend feugiat ante, id pellentesque odio maximus ac. Donec sodales vulputate sapien, non tristique ligula mattis nec. Maecenas rutrum, felis ac venenatis efficitur, nulla ante hendrerit felis, ut ultrices lectus ipsum in eros. Curabitur eleifend tincidunt arcu quis congue. Etiam nisl mi, interdum a luctus nec, ornare non massa.</p>
      </v-card-text>
    </v-card> -->
  </v-flex>
  <v-flex column xs12 md6>
    <v-card>
      <v-layout reverse row>
        <v-btn to="AddMelding" dark hover color="primary">
          <v-icon>add</v-icon>
          melding maken
        </v-btn>
      </v-layout>
      <v-flex>
        <v-expansion-panel popout>
          <v-expansion-panel-content v-for="melding in meldingen" :key="melding.id">
            <div slot="header" :active="true">
              <!-- <i class="material-icons">sms_failed</i> -->
              <h2>{{melding.titel}}</h2>
              <small>geplaatst door {{melding.teacher.firstname}} {{melding.teacher.lastname}} {{melding.datum}}</small>
            </div>
            <v-card>
              <v-card-text v-html="melding.tekst"></v-card-text>
              <v-card-actions v-if="melding.teacher.id === currentUser.id">
                <v-btn class="red" dark v-on:click="deleteMelding(melding.id)"><i class="material-icons">delete</i></v-btn>
              </v-card-actions>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-card>
  </v-flex>

</v-layout>
</template>

<script>
import moment from "moment";
import { mapGetters } from 'vuex';

export default {
  name: "dashboard",
  data() {
    return {
      meldingen: []
    };
  },
  computed: mapGetters(["currentUser"]),
  async created() {
    const meldingen = await this.$http.getMeldingen();
    this.meldingen = meldingen.map(m => Object.assign(m, {
      datum: moment(m.datum).fromNow()
    }))
  },
  methods: {
    async deleteMelding(id) {
      await this.$http.removeMelding(id);
      this.meldingen = this.meldingen.filter(m => m.id !== id);
    }
  }
};
</script>
