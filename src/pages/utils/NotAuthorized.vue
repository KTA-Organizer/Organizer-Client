<template>
  <v-layout column>
    <h1>Oeps...</h1>
    <h2>U heeft geen rechten om de gevraagde actie uit te voeren.</h2>
    <p>Log in met een account dat meer rechten heeft of neem contact op met een beheerder.</p>
    <p>
      Keer terug naar het <router-link to="dashboard">dashboard</router-link>.
    </p>
  </v-layout>
</template>

<script>
export default {
  name: 'NotAuthorized',
}
</script>

<style scoped>
</style>
