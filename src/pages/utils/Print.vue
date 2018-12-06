<template>

<main>
  <v-layout row-wrap class="mt-5">
  <v-flex xs2 offset-xs1>
    <checkboxes @update-filters="updateFilters" :listobject="opleidingen" v-if="receivedData"></checkboxes>
  </v-flex>
  <v-flex xs6>
    <datatableselects :filters="filters"></datatableselects>
  </v-flex>
  <v-flex xs2>
    <v-btn color="primary" class="ma-1 left" dark><v-icon dark>print</v-icon>&nbsp;</v-btn>
    <v-btn color="primary" class="ma-1 left" dark><v-icon dark>get_app</v-icon>&nbsp;</v-btn>
  </v-flex>
    </v-layout>
</main>
</template>

<script>
export default {
  name: 'Print',
  data () {
    return {
      search: '',
      selected: [],
      filters: [],
      headers: [
        { text: 'Student', align: 'left', value: 'student' },
        { text: 'Opleiding', align: 'left', value: 'opleiding' },
        { text: '', value: 'rapportid' }
      ],
      receivedData: false,
      items: [],
      opleidingen: []
    }
  },
  methods: {
    updateFilters (payload) {
      this.filters = payload
    }
  },
  created () {
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
