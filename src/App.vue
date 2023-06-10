<template>
  <div id="app">
    <trip-route-map :list-of-dest="listOfDest" :trip-name="tripName" :list-of-trip-names="listOfTripNames" :suggestedNextDests="suggestedNextDests">
    </trip-route-map>
  </div>
</template>


<script lang="ts">
import Vue, { PropType } from 'vue';
import Component from 'vue-class-component';
import { Destination } from './utils/triproute';
import TripRouteMap from './components/TripRoute.vue';

const TripPlannerAppProps = Vue.extend({
    props: {
        listOfDest: {
            required: true,
            type: Array as PropType<Array<Record<string, Destination>>>
        },
        tripName: {
            required: true,
            type: String
        },
        listOfTripNames: {
            required: true,
            type: Array as PropType<Array<string>>
        },
        suggestedNextDests: {
            required: true,
            type: Array as PropType<Array<Destination>>
        }
    }
})


@Component({
    components: {
        TripRouteMap
    }
})

export default class App extends TripPlannerAppProps {}
</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
@import './variables.css';

html, body {
    font-family: var(--font-family);
}

button {
    font-family: inherit;
    background-color: var(--btn-bg-color);
    border-radius: 10px;
    border: 1px solid var(--btn-border-color);
    color: var(--btn-text-color);
    margin-left: 2px;
    margin-right: 2px;
}

button:hover {
    background-color: var(--btn-hover-color);
    cursor: pointer;
}


#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--app-text-color);
  height: 100%;
 /* margin-top: 60px;*/
}

</style>
