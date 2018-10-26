<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs11 sm8 md10 class="text-xs-left">
        <h1 class="display-3">Gebruikers</h1>
      </v-flex>
    </v-layout>

    <main>
      <v-content class="pt-1">
          <router-view />
      </v-content>
    </main>
  </v-container>
</template>

<script>
export default {
  name: "Users"
}
</script>

