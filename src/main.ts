import Vue from 'vue'
import App from './App.vue'
import axios from 'axios';
import { Modal } from './utils/modal';
import { Destination, Trip } from './utils/triproute';

Vue.config.productionTip = false

// root instance
new Vue({
	render(h){
		// TODO: fetch user's tripdata from db here??
		return h(App, {
			props: {
				'listOfDest': this.tripData[this.currTripIndex].listOfDest,
				'tripName': this.tripData[this.currTripIndex].tripName,
				'listOfTripNames': this.tripData.map(trip => trip.tripName),
				'suggestedNextDest': this.suggestedNextDest, // should be based on last destination in list
			}
		});
	},
	data: {
		'tripData': [
			{
				'tripName': 'my first trip',
				'listOfDest': [
					{
						"name": "test",
						"latitude": 38.9486650738765,
						"longitude": -77.01459411621002,
						"notes": "hello world",
						"fromDate": "01-01-2020",
						"toDate": "01-05-2020",
						"images": [] as string[],
						"routeColor": "#888"
					},
					{
						"name": "test2",
						"latitude": 38.982833520960156,
						"longitude": -76.95210937499908,
						"notes": "hello world2",
						"fromDate": "01-05-2020",
						"toDate": "01-07-2020",
						"images": [] as string[],
						"routeColor": "#888"
					}
				]
			}
		],
		'currTripIndex': 0,
		'suggestedNextDest': [],
		'canGetSuggestedNextDest': false,
		'fakeSuggestions': [
			{
				"username": "test_user1",
				"destname": "test_place1",
				"tripname": "test_trip1",	
				"latitude": 39.002833520960156,
				"longitude": -76.55210937499908,
				"index": 0,
				"metadata": {
					"notes": "hello world2 sdfsdf",
					"fromDate": "01-05-2020",
					"toDate": "01-07-2020",
					"images": [],
					"routeColor": "#888"
				}
			},
			{
				"username": "test_user1",
				"destname": "test_place2",
				"tripname": "test_trip1",	
				"latitude": 39.048987979347004,
				"longitude": -76.91640380859292,
				"index": 1,
				"metadata": {
					"notes": "hello world2 sdfsdf sdfgsdfg",
					"fromDate": "01-05-2020",
					"toDate": "01-07-2020",
					"images": [],
					"routeColor": "#888"
				}
			},
			{
				"username": "test_user1",
				"destname": "test_place3",
				"tripname": "test_trip1",	
				"latitude": 38.848987979347004,
				"longitude": -77.01640380859292,
				"index": 2,
				"metadata": {
					"notes": "hello world2 sdfsdf sdfgsdfg",
					"fromDate": "01-05-2020",
					"toDate": "01-07-2020",
					"images": [],
					"routeColor": "#888"
				}
			},
			{
				"username": "test_user1",
				"destname": "test_place4",
				"tripname": "test_trip1",	
				"latitude": 37.948987979347004,
				"longitude": -77.01640380859292,
				"index": 3,
				"metadata": {
					"notes": "something",
					"fromDate": "01-05-2020",
					"toDate": "01-07-2020",
					"images": [],
					"routeColor": "#888"
				}
			},
		],
	},
	methods: {
		requestSuggestedNextHops: function(lat: number, long: number): Promise<any[]> {
			//console.log("requesting next hop suggestions");
			return new Promise((resolve) => {
				// should be based on last destination in list
				axios.post("http://localhost:8081/api/destinations", {
					latitude: lat,
					longitude: long,
					radius: 5, // 5 km for now?
				})
					.then(res => {
						const suggestedNextDestinations: any[] = (res as any).data.destinations;
						resolve(suggestedNextDestinations);
					})
					.catch(error => {
						resolve([]); // database could not be connected to
					});
			});
		},
        
		findDestination: function(destName: string): boolean {
			const listOfDest = this.tripData[this.currTripIndex].listOfDest;
			for (const dest of listOfDest) {
				if (dest.name === destName) {
					return true;
				}
			}
			return false;
		},
        
		removeDestination: function(destName: string): void {
			const currDests = this.tripData[this.currTripIndex].listOfDest;
			this.tripData[this.currTripIndex].listOfDest = currDests.filter(dest => dest.name !== destName);
			
			// TODO: check to see if the last destination of the list was removed and if there is a new last destination. 
			// if so, take the current last dest and show next hop suggestions for that dest (if show next hops option selected)
			// right now just handle when demoing
			if(!this.canGetSuggestedNextDest){
				//@ts-ignore TODO: investigate this? (TS-2339)
				(this as any).suggestedNextDest = this.getFakeSuggestions();
			}
		},
        
		updateDestination: function(data: Destination): void {
			// called from Destination.vue
			// TODO: is there a better way to do this update?
			const listOfDest = this.tripData[this.currTripIndex].listOfDest;
			const currName = data.name;
			let changeName = false;
			let newName = "";

			if (data.newName) {
				newName = data.newName; // new desired destination name

				//@ts-ignore TODO: investigate this? (TS-2339)
				const destWithNewNameExists = this.findDestination(newName);

				if (currName !== newName && !destWithNewNameExists) {
					changeName = true;
				} else if (currName !== newName && destWithNewNameExists) {
					// a destination with the new name already exists
					// just don't update the destination name but alert the user
					alert("Can't change name because a destination already exists with the same name!");
				}
			}

			for(let i = 0; i < listOfDest.length; i++) {
				const dest = listOfDest[i];
				if(dest.name === currName) {
					// TODO: just do for prop in dest, reassign?
					// so we don't have to manually update this each time there's a new prop
					dest.notes = data.notes;
					dest.fromDate = data.fromDate;
					dest.toDate = data.toDate;
					dest.images = data.images;
					dest.routeColor = data.routeColor;

					if (changeName) {
						dest.name = newName;
					} else {
						dest.name = currName;
					}

					break;
				}
			}
		},
        
		updateTripName: function(name: string): void {
			if(!this.tripData.some((x: Trip) => x.tripName === name)){
				// no other trip exists with this name so we can update
				const currTrip = this.tripData[this.currTripIndex];
				currTrip.tripName = name;
				console.log("trip name updated");
			}
		},
        
		addNewTrip: function(name: string): void {
			// TODO: check for existing trip name? allow duplicate names?
			const newTrip = {
				tripName: name,
				listOfDest: []
			};
			this.tripData.push(newTrip);
			this.currTripIndex = this.tripData.length - 1;
		},
        
		selectTrip: function(tripIndex: number): void {
			this.currTripIndex = tripIndex;
		},
		
		importData: function(evt: any): void {
			const reader = new FileReader();
			const file = evt.target.files[0];
			
			if(file){
				reader.onload = (() => {
					return (evt: any): void => { 
						const data: any = JSON.parse(evt.target.result);
						
						if(!data.length || !data[0].tripName || !data[0].listOfDest){
							alert("sorry, trip data could not be imported! please check the format.");
							return;
						}
						
						// switch current trip to this one
						this.tripData.push(data[0]);
						this.currTripIndex = this.tripData.length - 1;
					}
				})();
				
				reader.readAsText(file);
			}
		},
		
		exportData: async function(): Promise<void> {
			const data = JSON.parse(JSON.stringify(this.tripData)); // make a copy
			for(const trip of data) {
				for(const dest of trip.listOfDest) {
					dest.images = []; // don't export images...for now?
				}
			}
			const jsonData = JSON.stringify(data, null, 4);
			const blob = new Blob([jsonData], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
            
			const modal = new Modal();
			const filename = await modal.createInputModal("What would you like to name the exported file?");
			
			if(filename){
				link.download = filename ? `${filename}.json` : "trip-planner-data.json";
				link.click();
			}
		},
        
		// TODO: figure out the correct typing for fakeSuggestions elements and don't use any. they aren't Destination... 
		getFakeSuggestions: function(): Array<any> {
			// filter based on proximity (this is just for when using fake data. the database is supposed to
			// handle finding the closest destinations)
			const currTripDestList: Array<Destination> = this.tripData[this.currTripIndex].listOfDest;
			const lat = (currTripDestList[currTripDestList.length-1].latitude * Math.PI) / 180;
			const lng = (currTripDestList[currTripDestList.length-1].longitude * Math.PI) / 180;
            
			const newSuggestions = this.fakeSuggestions.filter((x: any) => {
				const lngRad = (x.longitude * Math.PI) / 180;
				const latRad = (x.latitude * Math.PI) / 180;
				return Math.acos(Math.sin(lat) * Math.sin(latRad) + Math.cos(lat) * Math.cos(latRad) * Math.cos(lng - lngRad)) * 6371 <= 20;
			});
            
			return newSuggestions;
		},
	},
	
	mounted: function(): void {
		// listen for the custom event 'addDest' from the iframe (which is the map)
		// every time we add a new destination and the user wants next destination suggestions,
		// we make a call to the API server to fetch those suggestions.
		document.addEventListener('addDest', (evt) => {
			// if adding a new destination was successful to the iframe map, a custom addDest event will be
			// emitted from the iframe along with that new destination's data, which gets received here.
			const location = (evt as CustomEvent).detail;

			if(location) {
				const newDest: Destination = {
					name: location.name,
					latitude: location.latitude,
					longitude: location.longitude,
					toDate: "",
					fromDate: "",
					notes: "",
					images: [],
					routeColor: "#888"
				};
				
				this.tripData[this.currTripIndex].listOfDest.push(newDest);
				
				if(this.canGetSuggestedNextDest){
					// Make a call to the db with the newly added dest's lat and lng to look up possible next hops
					// when we get that info back, update the prop so the change will get propagated to TripRoute.vue.
					(this as any).requestSuggestedNextHops(location.latitude, location.longitude).then((data: any) => {
						this.suggestedNextDest = data;
					});					
				}else{
					// for demoing
					//@ts-ignore TODO: investigate this? (TS-2339)
					(this as any).suggestedNextDest = this.getFakeSuggestions();
				}
			}
		});

		// make a call for all the trip info for this user
		// for now use 'user1' as the username to demo
		axios.post("http://localhost:8081/api/userDestinations", {
			username: "user1"
		})
			.then(res => {
				this.tripData = res.data.trips;      // get user's trips
				this.canGetSuggestedNextDest = true; // since we can connect to the database
			
				// get suggested next hops using the currently last destination in the current trip
				const currTripDestList: Array<Destination> = this.tripData[this.currTripIndex].listOfDest;
				const lat = currTripDestList[currTripDestList.length-1].latitude;
				const lng = currTripDestList[currTripDestList.length-1].longitude;
			
				(this as any).requestSuggestedNextHops(lat, lng).then((data: any) => {
					this.suggestedNextDest = data;
				});
			})
			.catch(error => {
				// database couldn't be connected to
				// we can't get suggested next hops when a new destination is added
				// use fake data instead for now
				//@ts-ignore TODO: investigate this? (TS-2339)
				(this as any).suggestedNextDest = this.getFakeSuggestions();
			});
	}
}).$mount('#app') // #app is in /public/index.html
