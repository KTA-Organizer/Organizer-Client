<template>
    <v-flex class="mt-4">
            <v-data-table
            v-bind:headers="headers"
            :items="users"
            hide-actions
            class="elevation-1"
            >
              <template slot="items" slot-scope="gebruiker">
                <tr>
                  <td class="text-xs-left">{{ gebruiker.item.naam }}</td>
                  <td class="text-xs-left">{{ helper.getKeyByValue(constants.roleKeys, gebruiker.item.role) }}</td>
                  <td class="text-xs-left">{{ gebruiker.item.email }}</td>
                  <td class="text-xs-left">{{ gebruiker.item.gender }}</td>
                  <td class="text-xs-left">{{ helper.getKeyByValue(constants.statusKeys, gebruiker.item.status) }}</td>
                  <td class="text-xs-left">{{ readableDate(gebruiker.item.accountCreatedTimestamp) }}</td>
                  <td><router-link :to="`/Gebruikers/${gebruiker.item.id}`"><v-btn color="primary"><i class="material-icons">remove_red_eye</i></v-btn></router-link></td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
</template>

<script>
import * as router from "../../router/index";
import moment from "moment";
import * as constants from "../../constants/user"
import * as helper from "../../constants/helpers";

export default {
  name: "UserDetail",
  props: ["users", "headers"],
  data() {
    return {
      constants: constants,
      helper: helper
    };
  },
  methods: {
    readableDate(timeStamp) {
      return moment(timeStamp).format('L LT');
    },
    redirectToDetails(id) {
      this.$router.push(`Gebruikers/${id}`);
    }
  },
};
</script>
