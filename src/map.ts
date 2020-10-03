// stuff for accessing map resources via mapbox's API
// https://docs.mapbox.com/mapbox-gl-js/api/

/*
helpful links and stuff because I just started using Typescript

need to import types :
https://stackoverflow.com/questions/60322612/what-are-the-correct-types-to-map-variables-using-mapbox-in-react
https://stackoverflow.com/questions/61308006/how-to-correctly-import-custom-types-in-typescript

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
		this.map = new mapboxgl.Map({
			container: container_id,
			style: 'mapbox://styles/mapbox/streets-v11'
		});
	}
	
	getContainerId(): string {
		return this.container_id;
	}
}

export {
	MapBoxWrapper
}