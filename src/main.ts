import Vue from 'vue'
import App from './App.vue'
import axios from 'axios';
import { Destination } from './triproute';

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
			const tripData = this.tripData;
			
			if(file){
				reader.onload = (function(){
					return function(e: any){ 
						const data: any = JSON.parse(e.target.result);
						
						if(!data.length || !data[0].tripName || !data[0].listOfDest){
							alert("sorry, trip data could not be imported! please check the format.");
							return;
						}
						
						// switch current trip to this one
						tripData.push(data[0]);
					}
				})();
				
				reader.readAsText(file);
			}
		},
		
        exportData: function(): void {
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
            link.download = "trip-planner-data.json"; // TODO: ask user for file name
            link.click();
        }
    },
	
    mounted: function() {
        // TODO: at some point we want to load in all the trip routes of this user
        // (after we have user profiles and stuff set up)
		
		// listen for the custom event 'addDest' from the iframe (which is the map)
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
			const ln = currTripDestList[currTripDestList.length-1].longitude;
			
			(this as any).requestSuggestedNextHops(lat, ln).then((data: any) => {
				this.suggestedNextDest = data;
			});
        })
		.catch(error => {
			// database couldn't be connected to
			// in this case we can't get suggested next hops when a new destination is added
		});
    }
}).$mount('#app') // #app is in /public/index.html
