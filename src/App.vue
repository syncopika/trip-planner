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
    @Prop({ required: true }) public listOfDest!: Array<Object>;
    @Prop({ required: true }) public tripName!: string;
    @Prop({ required: true }) public listOfTripNames!: Array<string>;
    @Prop({ required: true }) public suggestedNextDest!: any[];

    mounted() {}
}
</script>


<style>
#app {
  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
 /* margin-top: 60px;*/
}

</style>
