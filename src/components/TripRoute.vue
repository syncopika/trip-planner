<template>
	<div id='main'>
		<!-- the map and recommended destinations -->
		<div id='column1'>
			<!-- make the mapContainer a component that can receive height and width? -->
			<div id='container'>
				<iframe id='mapContainer' width='1400' height='900' src='./mapIframe.html'></iframe>
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
				<h1 id='tripTitle'>{{tripName}}</h1>
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
//import { Destination } from '../triproute'; //instead of array<obj>, why not array<destination>?

@Component({
	components: {
		DestinationList,
		Navigation
	}
})

export default class TripRouteMap extends Vue {
	
	@Prop({ required: true }) public listOfDest!: Array<Object>; // the ! == not null
    @Prop({ required: true }) public listOfTripNames!: Array<string>;
	@Prop({ required: true }) public tripName!: string;
	@Prop({ required: true }) public suggestedNextDest!: any[];

	showSuggestedNextHops = false;

	@Watch('listOfDest', { deep: true })
	onDestChange(newVal: Array<Object>, oldVal: Array<Object>): void {
		// note that we shouldn't need to care about the old value
		this.updateMap(newVal);
		console.log(newVal);
		console.log(oldVal);

		// whenever listOfDest changes, suggestedNextDest should too
        if(this.showSuggestedNextHops) {
            this.updateSuggestedNextHops(this.suggestedNextDest);
        }
	}

	dispatchEventToMap(eventName: string, data: Array<Object>): void {
        // send a custom event to the map iframe along with the data
        let updateMapEvent = new CustomEvent(eventName, { detail: data });
        let mapIframe = document.getElementById('mapContainer') as HTMLIFrameElement;

        if(mapIframe !== null && mapIframe.contentDocument !== null) {
            console.log("sending data to the iframe for event: " + eventName);
            mapIframe.contentDocument.dispatchEvent(updateMapEvent);
        }
    }
	
    updateMap(data: Array<Object>): void {
		// take new destination data and update the MapBox map markers as needed
		console.log("I'm supposed to update the map!");
		this.dispatchEventToMap('updateMap', data);
	}

	updateSuggestedNextHops(data: Array<Object>): void {
        this.dispatchEventToMap('updateSuggestedNextHops', data);
    }

	toggleTripSuggestions(): void {
        this.showSuggestedNextHops = !this.showSuggestedNextHops;
    }
	
    _handleIframeLogs(evt: any): void {
		console.log(evt);
	}
	
    _handleReady(): void {
		console.log("got iframe ready message!!");
		this.updateMap(this.listOfDest);

        if(this.showSuggestedNextHops) {
			this.updateSuggestedNextHops(this.suggestedNextDest);
        }
	}

	/*
	data() {
		return {
            showSuggestedNextHops: false,
        }
    }*/
	
	mounted(){
		// the iframe might not be ready?
		// so listen for the ready event first
		window.document.addEventListener('imready', this._handleReady, false);		
		
		// set up listeners for any messages that come from the iframe
		window.document.addEventListener('iframeLogs', this._handleIframeLogs, false);
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
	font-family: monospace;
	background-color: black;
}

#container{
	text-align: center;
	border-top: 1px solid #000;
	border-left: 1px solid #000;
	border-bottom: 1px solid #000;
	height: auto;
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
	padding: 4px;
	background-color: #6A5ACD;
	border-radius: 10px;
	border: 1px solid #483D8B;
	color: #fff;
}
</style>