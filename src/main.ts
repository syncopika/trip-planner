import Vue from 'vue'
import App from './App.vue'
import { TripRoute, Destination } from './triproute';

Vue.config.productionTip = false

// root instance
new Vue({
  render(h){
        // fetch data from db here??
        return h(App, {
            props: {
                'listOfDest': this.tripData[this.currTripIndex].listOfDest,
                'tripName': this.tripData[this.currTripIndex].tripName,
                'listOfTripNames': this.tripData.map(trip => trip.tripName),
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
                        "fromDate": "2020-01-01",
                        "toDate": "2020-01-05",
                        "images": [] as string[]
                    },
                    {
                        "name": "test2",
                        "latitude": 38.982833520960156,
                        "longitude": -76.95210937499908,
                        "notes": "hello world2",
                        "fromDate": "2020-01-05",
                        "toDate": "2020-01-07",
                        "images": [] as string[]
                    }
                ]
            }
        ],
        'currTripIndex': 0
    },
    methods: {
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
                if (dest.name === currName) {
                    dest.notes = data.notes;
                    dest.fromDate = data.fromDate;
                    dest.toDate = data.toDate;
                    dest.images = data.images;

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
            //console.log(evt);
            let location = (<CustomEvent>evt).detail;

            // the check against existing destination names should be done
            // at the iframe level? since the iframe listens for the dblclick event.
            if (location) {
                let newDest: Destination = {
                    name: location.name,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    toDate: "",
                    fromDate: "",
                    notes: "",
                    images: []
                };

                tripRoute.addDestination(newDest);
                //console.log(tripRoute);

                this.tripData[this.currTripIndex].listOfDest.push(newDest); 
            }
        });
    }
}).$mount('#app')
