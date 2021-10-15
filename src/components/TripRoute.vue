<template>
	<div id='main'>
		<!-- the map and recommended destinations -->
		<div id='column1'>
			<!-- make the mapContainer a component that can receive height and width? -->
			<div id='container'>
				<iframe id='mapContainer' src='./mapIframe.html'></iframe>
			</div>
			
			<div id='suggestions'>
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
						<li v-for="(nextDest, index) in suggestedNextDest"
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
			
			<!-- TODO: https://developer.mozilla.org/en-US/docs/Web/CSS/Layout_cookbook/Sticky_footers -->
			<div id='footer'>
				<p> footer </p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import DestinationList from './DestinationList.vue';
import Navigation from './Navigation.vue';
import { Destination } from '../utils/triproute';
import { Modal } from '../utils/modal';

@Component({
	components: {
		DestinationList,
		Navigation
	}
})

export default class TripRouteMap extends Vue {
	
	@Prop({ required: true }) public listOfDest!: Array<Destination>; // the ! means 'not null'
    @Prop({ required: true }) public listOfTripNames!: Array<string>;
	@Prop({ required: true }) public tripName!: string;
	@Prop({ required: true }) public suggestedNextDest!: any[];

	showSuggestedNextHops = false;

	@Watch('listOfDest', { deep: true })
	onDestChange(newVal: Array<Destination>, _: Array<Destination>): void {
		// note that we shouldn't need to care about the old value (the 2nd arg)
		this.updateMap(newVal);

		// whenever listOfDest changes, suggestedNextDest should too
        if(this.showSuggestedNextHops) {
            this.updateSuggestedNextHops(this.suggestedNextDest);
        }
	}

	dispatchEventToMap(eventName: string, data: Array<Destination>): void {
        // send a custom event to the map iframe along with the data
        const updateMapEvent = new CustomEvent(eventName, { detail: data });
        const mapIframe = document.getElementById('mapContainer') as HTMLIFrameElement;

        if(mapIframe !== null && mapIframe.contentDocument !== null) {
            //console.log("sending data to the iframe for event: " + eventName);
            mapIframe.contentDocument.dispatchEvent(updateMapEvent);
        }
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
		if(!this.showSuggestedNextHops) {
			this.updateSuggestedNextHops([]);
		} else {
            this.updateSuggestedNextHops(this.suggestedNextDest);
        }
    }
	
	// TODO: not completely implemented but this is for changing a trip name
	async toggleTripTitleEdit(evt: any): Promise<void> {
		if(evt.target.classList.contains("tripTitle")){
			evt.target.setAttribute("contenteditable", "true");
		}else{
			// check if we should edit the trip title. if the current text is of another
			// trip that already exists, don't allow it and reset the text
			// otherwise, update
			const trip = document.querySelector(".tripTitle"); // there should only be one trip shown at a time
			
			if(trip){
				const editedTripName = trip.textContent!.trim();
				if(editedTripName !== this.tripName && this.listOfTripNames.includes(editedTripName)){
					// TODO: having trouble figuring out the right logic to handle this when switching between trips from the dropdown
					// because this seems to get triggered, even though re-render is not a click event??
					//const modal = new Modal();
					//await modal.createMessageModal(`A trip named "${editedTripName}" already exists!`);
					trip.textContent = this.tripName;
				}else{
					// TODO: use a data or computed property based on the prop's value to update this.tripName
					// also, how would saving this trip work? the new name change would have to bubble up to the map holding all the trips in main.ts I think
					//this.tripName = editedTripName;
				}
				trip.setAttribute("contenteditable", "false");
			}
		}
	}
	
    _handleIframeLogs(evt: any): void {
		console.log(evt);
	}
	
    _handleReady(): void {
		console.log("got iframe ready message!!");
		this.updateMap(this.listOfDest);

		// this is false by default so not sure yet when this will ever happen
        if(this.showSuggestedNextHops) {
			this.updateSuggestedNextHops(this.suggestedNextDest);
        }
	}
	
	mounted(){
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

h1, h2, label{
	padding: 5px;
	margin: 0;
	color: #000;
}

label{
	font-size: 20px;
}

#main{
	display: flex;
	flex-direction: row;
	background-color: black;
}

#mapContainer{
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
}

#container{
	position: relative;
	text-align: center;
	border-top: 1px solid #000;
	border-left: 1px solid #000;
	border-bottom: 1px solid #000;
	width: 100%;
	padding-top: 93vh;
	overflow: hidden;
}

#suggestions{
	border-bottom: 1px solid #000;
	border-left: 1px solid #000;
	height: auto;
}

#column1 {
    flex: 3;
    background-color: #DEE6ED;
}

#column2 {
    flex: 1;
    border: 1px solid #000;
    background-color: #F9F4E1;
    padding: 3px;
}

#tripInfo {
    background-color: #EBDBD4;
    border-bottom: 1px solid #000;
}

ul{
  list-style-type: none;
  padding: 0;
}

li{
  margin: 0 10px 10px;
}

a{
  color: #42b983;
}

button {
	background-color: #6A5ACD;
	border-radius: 10px;
	border: 1px solid #483D8B;
	color: #fff;
	margin-left: 2px;
	margin-right: 2px;
}

</style>