import Vue from 'vue'
import App from './App.vue'
import { addNewDestination } from './utils';
import { TripRoute, Destination } from './triproute';

Vue.config.productionTip = false

new Vue({
  render(h){
	// fetch data from db here??
	return h(App, {
		props: {
			'listOfDest': [
				{
					"name": "test",
					"latitude": 1.0,
					"longitude": 1.0,
					"notes": ["hello world"]
				},
				{
					"name": "test2",
					"latitude": 1.0,
					"longitude": 1.0,
					"notes": ["hello world2"]
				}
			]
		}
	});
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
		console.log(evt);

		let location = (<CustomEvent>evt).detail;
		let destName = prompt('enter destination name');

		if(destName !== null){
			addNewDestination('stops', destName, location);

			let newDest = {
				name:      destName,
				latitude:  location.lat,
				longitude: location.lng,
				notes:     ""
			};

			tripRoute.addDestination(newDest);
			console.log(tripRoute);
		}

	});
  }
}).$mount('#app')
