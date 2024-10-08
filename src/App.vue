<template>
    <div id='main'>
        <!-- the map and recommended destinations -->
        <div id='column1'>
            <!-- TODO: make the mapContainer a component that can receive height and width? -->
            <div id='container'>
                <div v-if="appearanceOptions.showLocationLookup" id="searchLocationBar">
                    <label for="nameOfLocation">location name: </label>
                    <input id="nameOfLocation" type="text" />
                    
                    <label for="typeOfLocation"> type of location: </label>
                    <select id="typeOfLocation">
                        <option v-for="(key, index) in overpassApiKeys" v-bind:key="'option_overpass_key_' + index">  
                            {{ key }}
                        </option>
                    </select>
                    
                    <button class="searchLocationButton" @click="searchLocationWithOverpass"> search </button>
                    
                    <button class="searchLocationButton" @click="clearSearchResults"> clear </button>
                    
                    <p id="searchHelp" @click="showHelpModal"> help </p>
                </div>
                <iframe id='mapContainer' src='./mapIframe.html'></iframe>
            </div>
            
            <div v-if="appearanceOptions.showSuggestedDestinations" id='suggestions'>
                <label for="tripSuggestionsOption"> 
                    show suggestions for next dest in trip route? 
                </label>
                <select 
                        id="tripSuggestionsOption"
                        @change="toggleTripSuggestions"
                >
                    <option value="yes">
                        yes please!
                    </option>
                    <option selected value="no">
                        no thanks
                    </option>
                </select>
                
                <div v-if="showSuggestedNextHops">
                    <h3> check out these suggestions! </h3>
                    <ul>
                        <li v-for="(nextDest, index) in suggestedNextDests"
                            v-bind:key="'li_nextDest_' + index"
                        >
                            <p>{{ nextDest }}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        
        <!-- show navigation bar, destination list -->
        <div id='column2'>
            <navigation :list-of-trip-names="listOfTripNames"></navigation>
            
            <div id='tripInfo'>
                <h1 class='tripTitle'>{{tripName}}</h1>
                <destinationList :list-of-dest="listOfDest"></destinationList>
            </div>
            
            <!-- https://developer.mozilla.org/en-US/docs/Web/CSS/Layout_cookbook/Sticky_footers -->
            <footer id='footer'>
                <a href='https://github.com/syncopika/trip-planner' target='_blank'> source </a>
            </footer>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Destination, UserSelectedOptionsInModal } from './utils/triproute';
import DestinationList from './components/DestinationList.vue';
import Navigation from './components/Navigation.vue';
import { Modal } from './utils/modal';

export default defineComponent({

    data: function(){
        return {
            showSuggestedNextHops: false,
            overpassApiKeys: [], // e.g. https://wiki.openstreetmap.org/wiki/Key:amenity
        }
    },
    
    components: {
        DestinationList,
        Navigation
    },
    
    props: {
        listOfDest: {
            required: true,
            type: Array as PropType<Array<Destination>>
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
        },
        appearanceOptions: {
            required: true,
            type: Object as PropType<Record<string, boolean>>
        },
    },
    
    methods: {
        dispatchEventToMap: function(eventName: string, data: Array<Destination>): void {
            // send a custom event to the map iframe along with the data
            const updateMapEvent = new CustomEvent(eventName, {detail: data});
            const mapIframe = document.getElementById('mapContainer') as HTMLIFrameElement;

            if(mapIframe !== null && mapIframe.contentDocument !== null){
                //console.log("sending data to the iframe for event: " + eventName);
                mapIframe.contentDocument.dispatchEvent(updateMapEvent);
            }
        },
        
        updateMap: function(data: Array<Destination>): void {
            // take new destination data and update the MapBox map markers as needed
            //console.log("I'm supposed to update the map!");
            this.dispatchEventToMap('updateMap', data);
        },

        updateSuggestedNextHops: function(data: Array<Destination>): void {
            this.dispatchEventToMap('updateSuggestedNextHops', data);
        },

        toggleTripSuggestions: function(): void {
            this.showSuggestedNextHops = !this.showSuggestedNextHops;

            // make sure map reflects new value
            if(!this.showSuggestedNextHops){
                this.updateSuggestedNextHops([]);
            } else {
                this.updateSuggestedNextHops(this.suggestedNextDests);
            }
        },

        toggleTripTitleEdit: async function(evt: Event): Promise<void> {
            const el = evt.target as HTMLElement;
            
            if(el === null) return;
            
            if(el.classList.contains("tripTitle")){
                el.setAttribute("contenteditable", "true");
            }else{
                // check if we should edit the trip title. if the current text is of another
                // trip that already exists, don't allow it and reset the text
                // otherwise, update
                const trip = document.querySelector(".tripTitle"); // there should only be one trip shown at a time
                
                if(trip){
                    const editedTripName = trip.textContent ? trip.textContent.trim() : "";
                    if(editedTripName !== this.tripName && this.listOfTripNames.includes(editedTripName)){
                        // the new trip name already exists
                        trip.textContent = this.tripName;
                    }else{
                        this.$root.updateTripName(editedTripName);

                        // TODO: update db with new name?
                    }
                    trip.setAttribute("contenteditable", "false");
                }
            }
        },
        
        // use this function to search for location via the Overpass API
        // TODO: allow user to input a long and lat to search around?
        // TODO: if we get Way elements in the response, can we match to a Node element? compare with results using https://overpass-turbo.eu/
        searchLocationWithOverpass: function(): void {
            const locationInput = (document.getElementById('nameOfLocation') as HTMLInputElement).value;

            const locationTypeSelect: HTMLSelectElement = document.getElementById('typeOfLocation') as HTMLSelectElement;

            if(locationInput && locationTypeSelect){
                const locationType = locationTypeSelect.options[locationTypeSelect.selectedIndex].value;

                // search for locations - this will update the map showing any results found
                this.$root.getSearchResultsFromOverpass(locationType, "name", locationInput).then(async (data) => {
                    this.dispatchEventToMap('showSearchResults', data);
                    
                    const modal = new Modal();
                    await modal.createMessageModal(`${data.length} result(s) found for: ${locationInput}`);
                });
            }
        },
        
        clearSearchResults: function(): void {
            this.dispatchEventToMap('clearSearchResults', []);
        },
        
        showHelpModal: async function(): Promise<void> {
            const modal = new Modal();
            await modal.createMessageModal([
                "This feature allows you to search for a certain location by name using the Overpass API within a 20000m radius of the last destination in your list.",
                "Currently you can only query for shops (e.g. Costco, Safeway, etc.) or amenities (e.g. McDonald's, see https://wiki.openstreetmap.org/wiki/Key:amenity) but hopefully more to come eventually!"
            ], true);
        },

        _handleIframeLogs: function(evt: Event): void {
            console.log(evt);
        },
        
        _handleReady: function(): void {
            console.log("got iframe ready message!!");
            this.updateMap(this.listOfDest);

            // this is false by default so not sure yet when this will ever happen
            if(this.showSuggestedNextHops){
                this.updateSuggestedNextHops(this.suggestedNextDests);
            }
        }
    },
    
    created(): void {
        this.$watch('listOfDest', (newVal: Array<Destination>) => {
            this.updateMap(newVal);

            // whenever listOfDest changes, suggestedNextDests should too
            if(this.showSuggestedNextHops){
                this.updateSuggestedNextHops(this.suggestedNextDests);
            }
        }, {deep: true});

        this.$watch('suggestedNextDests', () => {
            if(this.showSuggestedNextHops){
                this.updateSuggestedNextHops(this.suggestedNextDests);
            }
        }, {deep: true});
    },
    
    mounted: function(): void {
        this.showSuggestedNextHops = false;

        // e.g. https://wiki.openstreetmap.org/wiki/Key:amenity
        this.overpassApiKeys = [
            "shop",
            "amenity",
        ];

        // the iframe might not be ready?
        // so listen for the ready event first
        window.document.addEventListener('imready', this._handleReady, false);        
        
        // set up listeners for any messages that come from the iframe
        window.document.addEventListener('iframeLogs', this._handleIframeLogs, false);
        
        // allow user to stop the trip title from being editable when clicking elsewhere other than the title text
        window.document.addEventListener('click', this.toggleTripTitleEdit);
    }
});
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

h1, h2, label {
    padding: 5px;
    margin: 0;
    color: var(--black);
}

label {
    font-size: 20px;
}

#main {
    display: flex;
    flex-direction: row;
    background-color: var(--black);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: var(--app-text-color);
    height: 100%;
}

@media screen and (max-width: 800px) {
    #main {
        display: flex;
        flex-direction: column;
        background-color: var(--black);
    }
}

#mapContainer {
    width: 100%;
    height: 100%;
}

#container {
    position: relative;
    text-align: center;
    border-top: 1px solid var(--black);
    border-left: 1px solid var(--black);
    border-bottom: 1px solid var(--black);
    height: 95vh;
    overflow: hidden;
}

@media screen and (max-width: 800px) {
    #container {
        height: 85vh;
    }
}


#suggestions {
    border-bottom: 1px solid var(--black);
    border-left: 1px solid var(--black);
    height: auto;
}

#column1 {
    flex: 3;
    background-color: var(--column-1-bg-color);
}

#column2 {
    flex: 1;
    border: 1px solid var(--black);
    background-color: var(--column-2-bg-color);
    padding: 3px;
    display: flex;
    flex-direction: column;
}

#footer {
    flex-grow: 0;
    flex-shrink: 0;
    padding: 5px;
}

#tripInfo {
    background-color: var(--destination-list-bg-color);
    border-bottom: 1px solid var(--black);
    flex-grow: 1;
}

#searchLocationBar {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: var(--transparent-white);
}

#searchLocationBar label {
    font-size: 1.1em;
}

#searchLocationBar > * {
    display: inline-block;
}

#searchHelp {
    text-decoration: underline;
    color: var(--bright-blue);
    margin-left: 5px;
    margin-right: 9px;
    font-weight: bold;
}

#searchHelp:hover {
    cursor: pointer;
}

#searchLocationButton {
    margin-left: 15px;
    margin-right: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0 10px 10px;
}

a {
  color: var(--black);
  text-decoration: none;
}

a:hover {
    color: var(--medium-grey);
}


</style>
