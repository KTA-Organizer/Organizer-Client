<template>
  <v-layout column>
    <h1>Oeps...</h1>
    <h2>Deze pagina bestaat niet</h2>
    <p>
      Keer terug naar het <router-link to="dashboard">dashboard</router-link>.
    </p>
  </v-layout>
</template>

<script>
export default {
  name: 'NotFound',
}
</script>

<style scoped>
</style>
