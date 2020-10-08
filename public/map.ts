// stuff for accessing map resources via mapbox's API
// https://docs.mapbox.com/mapbox-gl-js/api/

import mapboxgl, { Map } from 'mapbox-gl';

class MapBoxMonitor {
	// this will keep the current 'state' of the mapbox.
	// i.e. the markers (so we can delete if needed)
}


class MapBoxWrapper {
	key: 		  string;
	container:    HTMLElement;
	map:          Map;
	
	constructor(key: string, mapContainer: HTMLElement) {
		this.key = key;
		this.container = mapContainer;
		
		// get map data from MapBox API with key
		mapboxgl.accessToken = key;
		let map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [-77.04, 38.907],
			zoom: 10.00
		});
		
		// disable double-click zoom so we can configure double-click for adding 
		// a new destination
		map["doubleClickZoom"].disable();
		map.on('dblclick', (evt) => {
			// add marker 
			// confirm if selection ok
			let addMarker = confirm("add this spot as a destination?");
			if(addMarker){
				let marker = new mapboxgl.Marker()
				.setLngLat([evt.lngLat.lng, evt.lngLat.lat])
				.addTo(map);
				
				// send info to parent 
				// https://stackoverflow.com/questions/2046737/can-events-fired-from-an-iframe-be-handled-by-elements-in-its-parent
				const addDestEvent = new CustomEvent('addDest', {
					detail: {
						lng: evt.lngLat.lng, 
						lat: evt.lngLat.lat
					}
				});
				
				parent.document.dispatchEvent(addDestEvent);
				
			}
		});
		
		this.map = map;
	}
	
	getMapbox(): Map {
		return this.map;
	}
	
	getContainer(): HTMLElement {
		return this.container;
	}
}

export {
	MapBoxWrapper
}