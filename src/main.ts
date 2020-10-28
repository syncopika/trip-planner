import Vue from 'vue'
import App from './App.vue'
import { TripRoute, Destination } from './triproute';

Vue.config.productionTip = false

// root instance
new Vue({
  render(h){
	// fetch data from db here??
	return h(App, {
		props: {'listOfDest': this.listOfDest}
	});
  },
  data: {
	'listOfDest': [
		{
			"name": "test",
			"latitude": 38.9486650738765,
			"longitude": -77.01459411621002,
			"notes": "hello world"
		},
		{
			"name": "test2",
			"latitude": 38.982833520960156,
			"longitude": -76.95210937499908,
			"notes": "hello world2"
		}
	]
  },
  methods: {
      updateDestination: function(data : Destination): void {
          // called from Destination.vue. TODO: is there a better way to do this?
          for(let dest of this.listOfDest){
              if(dest.name === data.name){
                  dest.notes = data.notes;
                  break;
              }
          }
      },
      removeDestination: function(destName : string): void {
          this.listOfDest = this.listOfDest.filter(dest => dest.name !== destName);
      }
  },
  // don't forget that for each destination in data,
  // it needs to be marked on the map!
  mounted: function(){

	// at some point we want to load in all the trip routes of this user
	// (after we have user profiles and stuff set up)
	// for now, just have one triproute
	const tripRoute = new TripRoute("my first trip");
	
	// listen for custom events from the iframe (which is the map)
	document.addEventListener('addDest', (evt) => {
		//console.log(evt);

		let location = (<CustomEvent>evt).detail;

		// the check against existing destination names should be done
		// at the iframe level? since the iframe listens for the dblclick event.
		if(location){

			let newDest : Destination = {
				name:      location.name,
				latitude:  location.latitude,
				longitude: location.longitude,
				notes:     ""
			};

			tripRoute.addDestination(newDest);
			//console.log(tripRoute);
			
			this.listOfDest.push(newDest);
		}

	});
	
  }
}).$mount('#app')
