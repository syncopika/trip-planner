<template>

	<div id='main'>
	
		<!-- the map and recommended destinations -->
		<div id='column1'>
		
			<!-- make the mapContainer a component that can receive height and width? -->
			<div id='container'>
				<iframe id='mapContainer' width='1200px' height='600px' src='./mapIframe.html'></iframe>
			</div>
			
			<div id='suggestions'>
				<h2> suggestions for next dest in trip route go here </h2>
				<h3> other users have chosen these destinations next! </h3>
				<ul>
					<li> place 1 </li>
					<li> place 2 </li>
				</ul>
			</div>
		</div>
		
		<!-- show menu, route list -->
		<div id='column2'>
			
			<div id='menuHeader'>
				<!-- menu stuff goes here -->
				<h3> new trip </h3>
				<h3> | </h3>
				<h3> select trip </h3>
				<h3> | </h3>
				<h3> home </h3>
			</div>
			
			<div id='tripInfo'>
				<h2 id='tripTitle'> name of trip #1 </h2>
				<hr />
				
				<sidebar :list-of-dest="listOfDest"></sidebar>
				
			</div>
			
			<!-- https://developer.mozilla.org/en-US/docs/Web/CSS/Layout_cookbook/Sticky_footers -->
			<div id='footer'>
				<p> footer </p>
			</div>
		</div>

	</div>

</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
//import { Destination } from '../triproute'; //instead of array<obj>, why not array<destination>?
import Sidebar from './Sidebar.vue';

@Component({
	components: {
		Sidebar
	}
})

export default class TripRouteMap extends Vue {
	
	@Prop({required: true}) public listOfDest!: Array<Object>; // the ! == not null
	
	@Watch('listOfDest', { deep: true })
	onDestChange(newVal: Array<Object>, oldVal: Array<Object>){
		// note that we shouldn't need to care about the old value
		this.updateMap(newVal);
		console.log(newVal);
		console.log(oldVal);
	}
	
	updateMap(data : Array<Object>){
		// take new destination data and update the MapBox map markers as needed
		console.log("I'm supposed to update the map! probably...");
		
		// send a custom event to the map iframe along with the data
		let updateMapEvent = new CustomEvent('updateMap', {detail: data});
		let mapIframe = document.getElementById('mapContainer') as HTMLIFrameElement;
		
		if(mapIframe !== null && mapIframe.contentDocument !== null){
			console.log("sending data to the iframe");
			mapIframe.contentDocument.dispatchEvent(updateMapEvent);
		}
	}
	
	_handleIframeLogs(evt : any){
		console.log(evt);
	}
	
	mounted(){
		//console.log("gotta update those map markers!");
		//console.log(this.listOfDest);
		// update map here
		this.updateMap(this.listOfDest);
		
		
		// set up listeners for any messages that come from the iframe
		window.document.addEventListener('iframeLogs', this._handleIframeLogs, false);
	}
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

h1, h2{
	padding: 5px;
	margin: 0;
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

#column1{
	flex: 3;
	background-color: #fff;
}

#column2{
	flex: 1;
	border: 1px solid #000;
	background-color: #fff;
	padding: 3px;
}

#menuHeader{
	background-color: #32CD32;
	padding: 2px;
	text-align: right;
}

#menuHeader h3 {
	display: inline;
}

#tripInfo{
	background-color: gray;
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