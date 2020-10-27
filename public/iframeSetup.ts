// code for setting up the mapbox in the iframe
// eventually you'll want to set up some code so that
// when a certain action happens in the iframe, you can let the parent document know.

import { MapBoxWrapper } from './map';

let mapContainer : HTMLElement = document.getElementById('map') as HTMLElement;

// beware of secrets!! also know that it will show up in the resulting bundle file!!
let mapbox = new MapBoxWrapper("<your token here>", mapContainer);

// add some listeners to listen for events to update map stuff from the parent document
window.document.addEventListener('updateMap', updateMap, false);

// as soon as this iframe is setup,
// send a customevent to the parent telling it to send data
let readyEvent = new CustomEvent('imready');
window.parent.document.dispatchEvent(readyEvent);


function updateMap(evt : any){
	//console.log("in the iframe!");
	//console.log(evt.detail);
	
	// send back logs to parent window to confirm iframe received data
	let ackEvent = new CustomEvent('iframeLogs', {detail: "hi parent, I got the data. thanks!"});
	window.parent.document.dispatchEvent(ackEvent);

	// update the mapbox
	mapbox.removeMarkers();
	mapbox.updateMarkers(evt.detail);
}