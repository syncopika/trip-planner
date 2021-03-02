import Vue from 'vue'
import App from './App.vue'
import axios from 'axios';
import { TripRoute, Destination } from './triproute';

Vue.config.productionTip = false

// root instance
new Vue({
  render(h){
        // TODO: fetch tripdata from db here??
        // use the lat and lng of a dest to serve as the center point for which to find possible next hops based on radius

        /*
        axios.post("http://localhost:8081/api/destinations", {
			latitude: 0.0,
			longitude: 0.0,
			radius: 5,
		})
		.then((res) => {
			console.log(res);
			let suggestedNextDestinations = (res as any).data.destinations;
			this.suggestedNextDest = suggestedNextDestinations; // should be based on last destination in list
		});
        */

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
    },
    methods: {
        requestSuggestedNextHops: function(): Promise<any> {
            console.log("requesting next hop suggestions");
            return new Promise((resolve) => {
                // should be based on last destination in list
                axios.post("http://localhost:8081/api/destinations", {
                    latitude: 0.0,
                    longitude: 0.0,
                    radius: 5,
                })
                .then((res) => {
                    let suggestedNextDestinations = (res as any).data.destinations;
                    resolve(suggestedNextDestinations);
                });
            });
        },
        findDestination: function (destName: string): boolean {
            let listOfDest = this.tripData[this.currTripIndex].listOfDest;
            for (let dest of listOfDest) {
                if (dest.name === destName) {
                    return true;
                }
            }
            return false;
        },
        removeDestination: function (destName: string): void {
            let listOfDest = this.tripData[this.currTripIndex].listOfDest;
            this.tripData[this.currTripIndex].listOfDest = listOfDest.filter(dest => dest.name !== destName);

            // TODO: check to see if last dest was removed. if so, get the new last dest and show suggestions for next hop
            // if user wants
        },
        updateDestination: function (data: Destination): void {
            // called from Destination.vue
            // TODO: is there a better way to do this update?
            let listOfDest = this.tripData[this.currTripIndex].listOfDest;
            let currName = data.name;
            let changeName = false;
            let newName = "";

            if (data.newName) {
                newName = data.newName; // new desired destination name

                //@ts-ignore TODO: investigate this? (TS-2339)
                let destWithNewNameExists = this.findDestination(newName);

                if (currName !== newName && !destWithNewNameExists) {
                    changeName = true;
                } else if (currName !== newName && destWithNewNameExists) {
                    // a destination with the new name already exists
                    // just don't update the destination name but alert the user
                    alert("Can't change name because a destination already exists with the same name!");
                }
            }

            for (let i = 0; i < listOfDest.length; i++) {
                let dest = listOfDest[i];
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
        addNewTrip: function (name: string): void {
            // TODO: check for existing trip name? allow duplicate names?
            let newTrip = {
                tripName: name,
                listOfDest: []
            };
            this.tripData.push(newTrip);
            this.currTripIndex = this.tripData.length - 1;
        },
        selectTrip: function (tripIndex: number): void {
            this.currTripIndex = tripIndex;
        },
        exportData: function(): void {
            let data = JSON.parse(JSON.stringify(this.tripData)); // make a copy
            for(let trip of data) {
                for(let dest of trip.listOfDest) {
                    dest.images = []; // don't export images
                }
            }
            let jsonData = JSON.stringify(data, null, 4);
            let blob = new Blob([jsonData], { type: "application/json" });
            let url = URL.createObjectURL(blob);
            let link = document.createElement('a');
            link.href = url;
            link.download = "trip-planner-data.json"; // TODO: ask user for file name
            link.click();
        }
    },
    mounted: function() {
        // at some point we want to load in all the trip routes of this user
        // (after we have user profiles and stuff set up)
        // for now, just have one triproute
        let tripName = this.tripData[this.currTripIndex].tripName;
        const tripRoute = new TripRoute(tripName);
	
        // listen for custom events from the iframe (which is the map)
        document.addEventListener('addDest', (evt) => {
            // if adding a new destination was successful to the iframe map, a custom addDest event will be
            // emitted from the iframe along with that new destination's data, which gets received here.

            let location = (<CustomEvent>evt).detail;

            if (location) {
                let newDest: Destination = {
                    name: location.name,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    toDate: "",
                    fromDate: "",
                    notes: "",
                    images: [],
                    routeColor: "#888"
                };

                tripRoute.addDestination(newDest);

                // Make a call to the db with the newly added dest's lat and lng to look up possible next hops
                // when we get that info back, update the prop so the change will get propagated to TripRoute.vue.
                (this as any).requestSuggestedNextHops().then((data: any) => {
                    this.suggestedNextDest = data;
                    this.tripData[this.currTripIndex].listOfDest.push(newDest); 
                });
            }
        });
    }
}).$mount('#app')
