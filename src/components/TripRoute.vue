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
            <navigation @update-options="handleUpdateOptions" :list-of-trip-names="listOfTripNames"></navigation>
            
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
import DestinationList from './DestinationList.vue';
import Navigation from './Navigation.vue';

import Vue, { PropType } from 'vue';
import Component from 'vue-class-component';
import { Destination } from '../utils/triproute';
import { Modal } from '../utils/modal';

const TripRouteMapProps = Vue.extend({
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
            type: Object as PropType<Record<string, any>>
        },
    }
})

@Component({
    components: {
        DestinationList,
        Navigation
    }
})

export default class TripRouteMap extends TripRouteMapProps {

    showSuggestedNextHops = false;
    
    // e.g. https://wiki.openstreetmap.org/wiki/Key:amenity
    overpassApiKeys: string[] = [
        "shop",
        "amenity",
    ];

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
    }

    dispatchEventToMap(eventName: string, data: Array<Destination>): void {
        // send a custom event to the map iframe along with the data
        const updateMapEvent = new CustomEvent(eventName, {detail: data});
        const mapIframe = document.getElementById('mapContainer') as HTMLIFrameElement;

        if(mapIframe !== null && mapIframe.contentDocument !== null){
            //console.log("sending data to the iframe for event: " + eventName);
            mapIframe.contentDocument.dispatchEvent(updateMapEvent);
        }
    }
    
    // update any option value changes from the Navigation component
    // TODO: don't use any and make Record<string, string> more specific
    handleUpdateOptions(value: Record<string, string>): void {
        if(value.dataSource === "overpassApi"){
            //@ts-ignore TODO: can we fix this without ignoring? (TS-2339)
            this.$root.setOverpassApiUse(true, value.overpassApiEntity); // update useOverpassAPI in root
        }else{
            //@ts-ignore TODO: can we fix this without ignoring? (TS-2339)
            this.$root.setOverpassApiUse(false);
        }
        
        //@ts-ignore TODO: can we fix this without ignoring? (TS-2339)
        this.$root.updateAppearancePerOptions(value);
    }
    
    updateMap(data: Array<Destination>): void {
        // take new destination data and update the MapBox map markers as needed
        //console.log("I'm supposed to update the map!");
        this.dispatchEventToMap('updateMap', data);
    }

    updateSuggestedNextHops(data: Array<Destination>): void {
        this.dispatchEventToMap('updateSuggestedNextHops', data);
    }

    toggleTripSuggestions(): void {
        this.showSuggestedNextHops = !this.showSuggestedNextHops;

        // make sure map reflects new value
        if(!this.showSuggestedNextHops){
            this.updateSuggestedNextHops([]);
        } else {
            this.updateSuggestedNextHops(this.suggestedNextDests);
        }
    }

    async toggleTripTitleEdit(evt: Event): Promise<void> {
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
                    //@ts-ignore TODO: can we fix this without ignoring? (TS-2339)
                    this.$root.updateTripName(editedTripName);

                    // TODO: update db with new name?
                }
                trip.setAttribute("contenteditable", "false");
            }
        }
    }
    
    // use this function to search for location via the Overpass API
    // TODO: allow user to input a long and lat to search around?
    // TODO: if we get Way elements in the response, can we match to a Node element? compare with results using https://overpass-turbo.eu/
    searchLocationWithOverpass(): void {
        const locationInput = (document.getElementById('nameOfLocation') as HTMLInputElement).value;

        const locationTypeSelect: HTMLSelectElement = document.getElementById('typeOfLocation') as HTMLSelectElement;

        if(locationInput && locationTypeSelect){
            const locationType = locationTypeSelect.options[locationTypeSelect.selectedIndex].value;

            // search for locations - this will update the map showing any results found
            //@ts-ignore
            this.$root.getSearchResultsFromOverpass(locationType, "name", locationInput).then(async (data) => {
                this.dispatchEventToMap('showSearchResults', data);
                
                const modal = new Modal();
                await modal.createMessageModal(`${data.length} result(s) found for: ${locationInput}`);
            });
        }
    }
    
    clearSearchResults(): void {
        this.dispatchEventToMap('clearSearchResults', []);
    }
    
    async showHelpModal(): Promise<void> {
        const modal = new Modal();
        await modal.createMessageModal(`This feature allows you to search for a certain location by name using the Overpass API within a 20000m radius of the last destination in your list. Currently you can only query for shops (e.g. Costco, Safeway, etc.) or amenities (e.g. McDonald's, see https://wiki.openstreetmap.org/wiki/Key:amenity) but hopefully more to come eventually!`);
    }

    _handleIframeLogs(evt: Event): void {
        console.log(evt);
    }
    
    _handleReady(): void {
        console.log("got iframe ready message!!");
        this.updateMap(this.listOfDest);

        // this is false by default so not sure yet when this will ever happen
        if(this.showSuggestedNextHops){
            this.updateSuggestedNextHops(this.suggestedNextDests);
        }
    }
    
    mounted(): void {
        // the iframe might not be ready?
        // so listen for the ready event first
        window.document.addEventListener('imready', this._handleReady, false);        
        
        // set up listeners for any messages that come from the iframe
        window.document.addEventListener('iframeLogs', this._handleIframeLogs, false);
        
        // allow user to stop the trip title from being editable when clicking elsewhere other than the title text
        window.document.addEventListener('click', this.toggleTripTitleEdit);
    }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

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
}

@media screen and (max-width: 800px) {
    #main {
        display: flex;
        flex-direction: column;
        background-color: var(--black);
    }
}

#mapContainer {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
}

#container {
    position: relative;
    text-align: center;
    border-top: 1px solid var(--black);
    border-left: 1px solid var(--black);
    border-bottom: 1px solid var(--black);
    width: 100%;
    padding-top: 93vh;
    overflow: hidden;
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