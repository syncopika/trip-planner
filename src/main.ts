import Vue, {CreateElement, VNode} from 'vue'
import App from './App.vue'
import axios from 'axios';
import { Modal } from './utils/modal';
import {
    Destination,
    DestinationSuggestion,
    UserDestinationSuggestion,
    Trip,
    OverpassAPINode,
    OverpassAPIData,
    OverpassAPIOptions,
    OverpassAPIDestinationSuggestion
} from './utils/triproute';

Vue.config.productionTip = false

// root instance
new Vue({
    render(h: CreateElement): VNode {
        // TODO: fetch user's tripdata from db here??
        return h(App, {
            props: {
                'listOfDest': this.tripData[this.currTripIndex].listOfDest,
                'tripName': this.tripData[this.currTripIndex].tripName,
                'listOfTripNames': this.tripData.map(trip => trip.tripName),
                'suggestedNextDests': this.suggestedNextDests, // should be based on last destination in listOfDest
                'appearanceOptions': this.appearanceOptions,
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
        'username': 'user1',
        'currTripIndex': 0,
        'suggestedNextDests': [] as DestinationSuggestion[],
        'canGetSuggestedNextDests': false, // can get destinations from the database
        'useOverpassAPI': false,            // flag for using overpass api for getting nearby locations
        'overpassApiEntityToFind': "restaurant",
        'overpassApiKeyToFind': "amenity",
        'overpassApiEntityKeyMap': {
            "arts_centre": "amenity",
            "library": "amenity",
            "restaurant": "amenity",
            "aquarium": "tourism",
            "attraction": "tourism",
            "hotel": "tourism",
            "museum": "tourism",
        } as Record<string, string>,
        'appearanceOptions': {
            'showLocationLookup': false,
            'showSuggestedDestinations': false,
        },
        // TODO: maybe we can pull these fake suggestions from a json file?
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
        // get next destination suggestions from database
        requestSuggestedNextHops: function(lat: number, long: number): Promise<UserDestinationSuggestion[]> {
            //console.log("requesting next hop suggestions");
            return new Promise((resolve) => {
                // should be based on last destination in list
                // use 20 km radius for now
                axios.get(`http://localhost:8081/api/destinations?username=${this.username}&latitude=${lat}&longitude=${long}&radius=${20}`)
                    .then(res => {
                        const suggestedNextDestinations: UserDestinationSuggestion[] = res.data.destinations;
                        resolve(suggestedNextDestinations);
                    })
                    .catch(error => {
                        resolve([]); // database could not be connected to
                    });
            });
        },
        
        findDestination: function(destName: string): boolean {
            const listOfDest = this.tripData[this.currTripIndex].listOfDest;
            for(const dest of listOfDest){
                if(dest.name === destName){
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
            if(!this.canGetSuggestedNextDests){
                this.suggestedNextDests = this.getFakeSuggestions();
            }
        },
        
        updateDestination: function(data: Destination): void {
            // called from Destination.vue
            // TODO: is there a better way to do this update?
            const listOfDest = this.tripData[this.currTripIndex].listOfDest;
            const currName = data.name;
            let changeName = false;
            let newName = "";

            if(data.newName){
                newName = data.newName; // new desired destination name

                //@ts-ignore TODO: investigate this? (TS-2339)
                const destWithNewNameExists = this.findDestination(newName);

                if(currName !== newName && !destWithNewNameExists){
                    changeName = true;
                }else if(currName !== newName && destWithNewNameExists){
                    // a destination with the new name already exists
                    // just don't update the destination name but alert the user
                    alert("Can't change name because a destination already exists with the same name!");
                }
            }

            for(let i = 0; i < listOfDest.length; i++){
                const dest = listOfDest[i];
                if(dest.name === currName){
                    // TODO: just do for prop in dest, reassign?
                    // so we don't have to manually update this each time there's a new prop
                    dest.notes = data.notes;
                    dest.fromDate = data.fromDate;
                    dest.toDate = data.toDate;
                    dest.images = data.images;
                    dest.routeColor = data.routeColor;

                    if(changeName){
                        dest.name = newName;
                    }else{
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
        
        // add new destination manually via button
        addNewDestination(newDest: Destination): void {
            // add the new destination to our current list
            this.tripData[this.currTripIndex].listOfDest.push(newDest);
            
            // make sure map markers are updated
            const updateMapEvent = new CustomEvent('updateMap', {detail: this.tripData[this.currTripIndex].listOfDest});
            const mapIframe = document.getElementById('mapContainer') as HTMLIFrameElement;

            if(mapIframe !== null && mapIframe.contentDocument !== null){
                mapIframe.contentDocument.dispatchEvent(updateMapEvent);
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
		
        importData: function(evt: Event): void {
            const reader = new FileReader();
            const files = (evt.target as HTMLInputElement).files;
            
            if(files === null || files.length !== 1){
                return;
            }
            
            const file = files[0];
            
            if(file){
                reader.onload = (() => {
                    return (evt: Event): void => {
                        const data: Array<Trip> = JSON.parse(reader.result as string); // should be a list of trips
                        
                        data.forEach(trip => {
                            if(!trip.tripName || !trip.listOfDest){
                                alert("sorry, trip data could not be imported! tripName and listOfDest fields must be provided for each trip.");
                                return;
                            }
                        });
                        
                        this.tripData = data;
                        this.currTripIndex = 0;
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
        
        // this opens a new tab displaying info for the currently-viewed trip in html
        exportCurrTripHTML: function(): void {
            // TODO: improve this some more
            const currTripName = this.tripData[this.currTripIndex].tripName;
            const style = "<style>body{font-family:sans-serif;}</style>";
            
            let html = `<!doctype html><html><head><title>${currTripName}</title>${style}</head><body><h1>${currTripName}</h1><hr /><br />`;
            
            let tripInfo = "";
            
            // add in the content
            const currTripDestList: Array<Destination> = this.tripData[this.currTripIndex].listOfDest;
            currTripDestList.forEach((destination) => {
                const lngLatMatch = destination.notes.match(/@[0-9]+.[0-9]+,[0-9]+.[0-9]+/g);
                if(lngLatMatch){
                    // add embedded map if we can extract a location
                    const location = lngLatMatch[0].substring(1);
                    const embeddedMap = `<iframe src='https://maps.google.com/maps?&q=${location}&output=embed' width='425' height='350' frameborder='0'  
        scrolling='no' marginheight='0' marginwidth='0'></iframe>`;
                    tripInfo = `<h2>${destination.name}</h2><h3>from: ${destination.fromDate}, to: ${destination.toDate}</h3><p>${destination.notes}</p>${embeddedMap}<br />`;
                }else{
                    tripInfo = `<h2>${destination.name}</h2><h3>from: ${destination.fromDate}, to: ${destination.toDate}</h3><p>${destination.notes}</p><br />`;
                }
                
                html += tripInfo;
            });
            
            html += '</body></html>';
            
            const tab = window.open("about:blank", currTripName);
            if(tab){
                tab.document.write(html);
                tab.document.close();
            }
        },

        getFakeSuggestions: function(): Array<UserDestinationSuggestion> {
            // filter based on proximity (this is just for when using fake data. the database is supposed to
            // handle finding the closest destinations)
            const currTripDestList: Array<Destination> = this.tripData[this.currTripIndex].listOfDest;
            if(currTripDestList.length){
                const lat = (currTripDestList[currTripDestList.length-1].latitude * Math.PI) / 180;
                const lng = (currTripDestList[currTripDestList.length-1].longitude * Math.PI) / 180;
                
                const newSuggestions = this.fakeSuggestions.filter((x: UserDestinationSuggestion) => {
                    const lngRad = (x.longitude * Math.PI) / 180;
                    const latRad = (x.latitude * Math.PI) / 180;
                    return Math.acos(Math.sin(lat) * Math.sin(latRad) + Math.cos(lat) * Math.cos(latRad) * Math.cos(lng - lngRad)) * 6371 <= 20;
                });
                
                return newSuggestions;
            }else{
                return [];
            }
        },

        _makeOverpassRequest: function(query: string): Promise<OverpassAPIDestinationSuggestion[]> {
            const url = "https://overpass-api.de/api/interpreter";
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            
            function getResults(responseData: OverpassAPIData): OverpassAPIDestinationSuggestion[] {
                const elements = responseData.elements;
                console.log(elements);
                return elements.filter(x => x.tags && x.lon && x.lat).map((el: OverpassAPINode) => {
                    // TODO: add address if available (e.g. addr:city, addr:street, addr:state, etc.)
                    // TODO: maybe let tag info be optional? also, sometimes "way" elements are actual places - can we derive long and lat from its nodes maybe?
                    return {
                        'latitude': el.lat,
                        'longitude': el.lon,
                        'destname': el.tags.name,
                        'website': el.tags.website,
                        'type': el.tags.tourism
                    };
                });
            }
            
            return new Promise((resolve) => {
                axios.post<OverpassAPIData>(url, `data=${query}`, config).then(response => {
                    //console.log(getResults(response));
                    resolve(getResults(response.data));
                });
            });
        },

        // TODO: allow user to set radius?
        // keyType is like 'amenity' or 'tourism'
        // entity is like 'restaurant' or 'museum'
        getLocationsFromOverpass: function(lat: number, long: number, keyType: string, entity: string): Promise<OverpassAPIDestinationSuggestion[]> {
            /*
                url-decoded query for finding a certain entity within a 20000m radius

                [out:json][timeout:25];
                (
                node["${keyType}"="${entity}"](around:20000,${lat},+${long});
                );
                out+body+5;
                >;
                out+skel+qt;
            */
            const query = `%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0A(%0Anode%5B%22${keyType}%22%3D%22${entity}%22%5D(around%3A20000%2C${lat}%2C+${long})%3B%0A)%3B%0Aout+body+5%3B%0A%3E%3B%0Aout+skel+qt%3B`;

            return this._makeOverpassRequest(query);
        },

        // TODO: allow user to set radius?
        searchLocationsFromOverpass: function(lat: number, long: number, keyType: string, property: string, valueToFind: string): Promise<OverpassAPIDestinationSuggestion[]> {
            // find a shop with name as Costco (can also do "operator"= or "brand"=). nwr = node, way, relation
            // %5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0A(%0A++nwr%5B%22shop%22%5D%5B%22name%22%3D%22Costco%22%5D(around%3A20000%2C38.982833520960156%2C-76.95210937499908)%3B%0A)%3B%0Aout+body%3B%0A%3E%3B%0Aout+skel+qt%3B
            /*
                [out:json][timeout:25];
                (
                  nwr["shop"]["name"="Costco"](around:20000,38.982833520960156,-76.95210937499908);
                );
                out body;
                >;
                out skel qt;
            */
            // keyType = shop, tourism, amenity
            // property = name or operator or brand
            // valueToFind
            const query = `%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0A(%0A++nwr%5B%22${keyType}%22%5D%5B%22${property}%22%3D%22${valueToFind}%22%5D(around%3A20000%2C${lat}%2C${long})%3B%0A)%3B%0Aout+body%3B%0A%3E%3B%0Aout+skel+qt%3B`;

            return this._makeOverpassRequest(query);
        },

        getSuggestionsFromOverpass: function(keyType: string, entity: string): Promise<Array<OverpassAPIDestinationSuggestion>> {
            const currTripDestList: Array<Destination> = this.tripData[this.currTripIndex].listOfDest;
            return this.getLocationsFromOverpass(
                currTripDestList[currTripDestList.length-1].latitude,
                currTripDestList[currTripDestList.length-1].longitude,
                keyType,
                entity
            );
        },
        
        getSearchResultsFromOverpass: function(keyType: string, property: string, valueToFind: string): Promise<Array<OverpassAPIDestinationSuggestion>> {
            const currTripDestList: Array<Destination> = this.tripData[this.currTripIndex].listOfDest;
            return this.searchLocationsFromOverpass(
                currTripDestList[currTripDestList.length-1].latitude,
                currTripDestList[currTripDestList.length-1].longitude,
                keyType,
                property,
                valueToFind
            );
        },

        setOverpassApiUse: function(val: boolean, entity: string): void {
            this.useOverpassAPI = val;
            if(val){
                const overpassApiEntityKeyMap = this.overpassApiEntityKeyMap;
                if(entity){
                    this.overpassApiEntityToFind = entity;
                    this.overpassApiKeyToFind = overpassApiEntityKeyMap[entity];
                    
                    this.getSuggestionsFromOverpass(this.overpassApiKeyToFind, this.overpassApiEntityToFind).then((data) => {
                        this.suggestedNextDests = data;
                    });
                }
            }
        },
        
        updateAppearancePerOptions: function(options: Record<string, string>): void {
            this.appearanceOptions.showLocationLookup = options["showLocationLookup"] === "true";
            this.appearanceOptions.showSuggestedDestinations = options["showSuggestedDestinations"] === "true";
        },
        
        // get the Overpass API entity options available to search for
        getCurrentOverpassAPIOptions: function(): OverpassAPIOptions {
            return {
                useOverpassAPI: this.useOverpassAPI,
                selectedOverpassApiEntity: this.overpassApiEntityToFind,
                overpassEntities: Object.keys(this.overpassApiEntityKeyMap),
            };
        },
        
        getNextDestSuggestions: function(): void {
            if(this.useOverpassAPI){
                //@ts-ignore TODO: investigate this? (TS-2339)
                this.getSuggestionsFromOverpass(this.overpassApiKeyToFind, this.overpassApiEntityToFind).then((data) => {
                    this.suggestedNextDests = data;
                });
            }else{
                //@ts-ignore TODO: investigate this? (TS-2339)
                this.suggestedNextDests = this.getFakeSuggestions();
            }
        }
    },
	
    mounted: function(): void {
        // listen for the custom event 'addDest' from the iframe (which is the map)
        // every time we add a new destination and the user wants next destination suggestions,
        // we make a call to the API server to fetch those suggestions.
        document.addEventListener('addDest', (evt) => {
            // if adding a new destination was successful to the iframe map, a custom addDest event will be
            // emitted from the iframe along with that new destination's data, which gets received here.
            const location = (evt as CustomEvent).detail;

            if(location){
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
				
                if(this.canGetSuggestedNextDests && !this.useOverpassAPI){
                    // Make a call to the db with the newly added dest's lat and lng to look up possible next hops
                    // when we get that info back, update the prop so the change will get propagated to TripRoute.vue.
                    this.requestSuggestedNextHops(location.latitude, location.longitude).then((data: DestinationSuggestion[]) => {
                        this.suggestedNextDests = data;
                        this.tripData[this.currTripIndex].listOfDest.push(newDest);
                    });					
                }else{
                    // for demoing
                    this.tripData[this.currTripIndex].listOfDest.push(newDest);
                    this.getNextDestSuggestions();
                }
            }
        });

        // make a call for all the trip info for this user
        // for now use 'user1' as the username to demo
        axios.get(`http://localhost:8081/api/user-destinations/${this.username}`)
            .then(res => {
                this.tripData = res.data.trips;       // get user's trips
                this.canGetSuggestedNextDests = true; // since we can connect to the database

                // get suggested next hops using the currently last destination in the current trip
                const currTripDestList: Array<Destination> = this.tripData[this.currTripIndex].listOfDest;
                const lat = currTripDestList[currTripDestList.length-1].latitude;
                const lng = currTripDestList[currTripDestList.length-1].longitude;

                this.requestSuggestedNextHops(lat, lng).then((data: DestinationSuggestion[]) => {
                    this.suggestedNextDests = data;
                });
            })
            .catch(error => {
                // database couldn't be connected to
                // we can't get suggested next hops when a new destination is added
                // use fake data instead for now
                this.getNextDestSuggestions();
            });
    }
}).$mount('#app') // #app is in /public/index.html
