<template>
    <v-flex class="mt-4">
            <v-data-table
            v-bind:headers="headers"
            :items="users"
            hide-actions
            class="elevation-1"
            >
              <template slot="items" slot-scope="gebruiker"><!-- .item must be here, don't ask questions -->
                <tr >
                <td class="text-xs-left">{{ gebruiker.item.naam }}</td>
                <td class="text-xs-left">{{ getKeyByValue(roleKeys, gebruiker.item.role) }}</td>
                <td class="text-xs-left">{{ gebruiker.item.email }}</td>
                <td class="text-xs-left">{{ gebruiker.item.gender }}</td>
                <td class="text-xs-left">{{ getKeyByValue(statusKeys, gebruiker.item.status) }}</td>
                <td class="text-xs-left">{{ readableDate(gebruiker.item.accountCreatedTimestamp) }}</td>
                <!-- <td>
                    <a :href="'#/Evaluate?id=' + gebruiker.item.id" target="_blank"><v-btn color="primary" class="ma-1" dark>Evaluatie<v-icon dark right>assignment</v-icon></v-btn></a>
                    <router-link :to="{ path: 'Rapporten', query: { id: gebruiker.item.id, name: gebruiker.item.naam}}"><v-btn color="primary" class="ma-1" dark>rapport<v-icon dark right>import_contacts</v-icon></v-btn></router-link>
                    <router-link :to="{ path: 'Addstudent', query: { id: gebruiker.item.id }}"><v-btn color="primary" class="ma-1" dark><v-icon dark>edit</v-icon></v-btn></router-link>
                    <v-btn color="error" class="ma-1" dark @click="makeDialog(gebruiker.item)"><v-icon dark>delete</v-icon></v-btn>
                </td> -->
              </tr>
              </template>
            </v-data-table>
          </v-flex>
</template>

<script>
export default {
  name: "UserDetail",
  props: ["users", "headers"],
  data() {
    return {
      roleKeys: {
        "Geen filter": false,
        Administrator: "ADMIN",
        Student: "STUDENT",
        Leerkracht: "TEACHER",
        "Geen rol toegekent": "#"
      },
      statusKeys: {
        "Geen filter": false,
        Actief: "ACTIVE",
        "Wacht op activatie": "WAIT_ACTIVATION",
        "Niet actief": "DISABLED"
      }
    };
  },
  methods: {
    readableDate(timeStamp) {
      const stamp = timeStamp.split("T");
      const date = stamp[0].split("-");
      const time = stamp[1].split(":");
      let day = date[2];
      let month = date[1];
      const year = date[0];
      let hour = time[0];
      let minutes = time[1];
      return `${day}/${month}/${year}, ${+hour + 2}u${minutes}`;
    },
    getKeyByValue(object, value) {
      return Object.keys(object).find(key => object[key] === value);
    }
  }
};
</script>
