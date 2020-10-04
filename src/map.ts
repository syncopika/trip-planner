// stuff for accessing map resources via mapbox's API
// https://docs.mapbox.com/mapbox-gl-js/api/

/*
helpful links and stuff because I just started using Typescript

need to import types :
https://stackoverflow.com/questions/60322612/what-are-the-correct-types-to-map-variables-using-mapbox-in-react
https://stackoverflow.com/questions/61308006/how-to-correctly-import-custom-types-in-typescript


useful mapbox stuff:
https://docs.mapbox.com/mapbox-gl-js/example/toggle-interaction-handlers/
https://docs.mapbox.com/mapbox-gl-js/example/mouse-position/
https://docs.mapbox.com/mapbox-gl-js/example/add-a-marker/

*/

import mapboxgl, { Map } from 'mapbox-gl';

class MapBoxWrapper {
	key: 		  string;
	container_id: string;
	map:          Map;
	
	constructor(key: string, container_id: string) {
		this.key = key;
		this.container_id = container_id;
		
		// get map data from MapBox API with key
		mapboxgl.accessToken = key;
		let map = new mapboxgl.Map({
			container: container_id,
			style: 'mapbox://styles/mapbox/streets-v11'
		});
		
		// disable double-click zoom so we can configure double-click for adding 
		// a new destination
		map["doubleClickZoom"].disable();
		map.on('dblclick', (evt) => {
			// add marker 
			// confirm if selection ok
			let addMarker = confirm("add this spot as a destination?");
			if(addMarker){
				//JSON.stringify(evt.point);
				//console.log(evt.lngLat);
				//console.log([evt.lngLat.lng, evt.lngLat.lat]);
				//console.log(map);
				
				let marker = new mapboxgl.Marker()
				.setLngLat([evt.lngLat.lng, evt.lngLat.lat])
				.addTo(map);
			}
		});
		
		this.map = map;
	}
	
	getMapbox(): Map {
		return this.map;
	}
	
	getContainerId(): string {
		return this.container_id;
	}
}

export {
	MapBoxWrapper
}