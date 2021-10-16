<template>
  <div id="app">
    <trip-route-map :list-of-dest="listOfDest" :trip-name="tripName" :list-of-trip-names="listOfTripNames" :suggestedNextDest="suggestedNextDest">
	</trip-route-map>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import TripRouteMap from './components/TripRoute.vue';

@Component({
  components: {
    TripRouteMap
  }
})

export default class App extends Vue {
    @Prop({ required: true }) public listOfDest!: Array<Record<string, any>>;
    @Prop({ required: true }) public tripName!: string;
    @Prop({ required: true }) public listOfTripNames!: Array<string>;
    @Prop({ required: true }) public suggestedNextDest!: any[];
}
</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');

#app {
  font-family: 'Montserrat', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
 /* margin-top: 60px;*/
}

</style>
