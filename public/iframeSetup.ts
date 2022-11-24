// code for setting up the mapbox in the iframe
// eventually you'll want to set up some code so that
// when a certain action happens in the iframe, you can let the parent document know.

import { MapBoxWrapper } from './map';

const mapContainer: HTMLElement = document.getElementById('map') as HTMLElement;

// beware of secrets leakage!! know that it will show up in the resulting bundle file!!
const mapbox = new MapBoxWrapper("", mapContainer); // add token as first argument

// add some listeners to listen for events to update map stuff from the parent document
window.document.addEventListener('updateMap', updateMap, false);
window.document.addEventListener('updateSuggestedNextHops', showSuggestedNextHops, false);
window.document.addEventListener('changeMapStyle', changeMapStyle, false);
window.document.addEventListener('showSearchResults', showSearchResults, false);
window.document.addEventListener('clearSearchResults', clearSearchResults, false);

function updateMap(evt : any){
    // send back logs to parent window to confirm iframe received data
    const ackEvent = new CustomEvent('iframeLogs', {detail: "hi parent, I got the data. thanks!"});
    window.parent.document.dispatchEvent(ackEvent);

    // update the mapbox
    mapbox.removeMarkers();
    mapbox.updateMarkers(evt.detail);
    mapbox.drawLineBetweenMarkers();
}

function createAckEvent(message: string){
    return new CustomEvent('iframeLogs', {detail: message});
}

function showSuggestedNextHops(evt: any){
    window.parent.document.dispatchEvent(createAckEvent(
        "hi parent, got the data for suggested next hops!"
    ));

    // show suggested next hop markers on map
    mapbox.showSuggestedNextHops(evt.detail);
}

function changeMapStyle(evt: any){
    window.parent.document.dispatchEvent(createAckEvent(
        "hi parent, updating the map style like you asked!"
    ));
    
    mapbox.changeMapStyle(evt.detail);
}

function showSearchResults(evt: any){
    window.parent.document.dispatchEvent(createAckEvent(
        "hi parent, got the data for search results!"
    ));
    
    mapbox.showSearchResults(evt.detail);
}

function clearSearchResults(evt: any){
    window.parent.document.dispatchEvent(createAckEvent(
        "hi parent, clearing search results!"
    ));
    
    mapbox.clearSearchResults();
}


// as soon as this iframe is setup,
// send a customevent to the parent telling it to send data
mapbox.getMap().on('load', () => {
    const readyEvent = new CustomEvent('imready');
    window.parent.document.dispatchEvent(readyEvent);
});