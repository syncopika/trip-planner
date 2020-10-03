<template>
  <div id="app">
    <TripRouteMap/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TripRouteMap from './components/MainPage.vue';

@Component({
  components: {
    TripRouteMap,
  },
})
export default class App extends Vue {}
</script>


<style>
@import "<link href='https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css' rel='stylesheet' />"

#app {
  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
 /* margin-top: 60px;*/
}

</style>
