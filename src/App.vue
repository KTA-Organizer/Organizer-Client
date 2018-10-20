<template>
  <div id="app">
    <div class="app-container" v-if="checkedAuthentication">
      <router-view/>
    </div>
    <div class="app-container" v-if="!checkedAuthentication">
      <h1>Loading</h1>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from './store/index'

export default {
  name: 'app',
  computed: mapGetters([ "checkedAuthentication" ])
}

store.dispatch("checkAuthentication");

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
