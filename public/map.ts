// stuff for accessing map resources via mapbox's API
// https://docs.mapbox.com/mapbox-gl-js/api/

import mapboxgl, { Map, Marker } from 'mapbox-gl';

class MapBoxWrapper {
	key: 		  string;
	container:    HTMLElement;
	map:          Map;
	markers:      Array<Marker>;
	
	constructor(key: string, mapContainer: HTMLElement) {
		this.key = key;
		this.container = mapContainer;
		this.markers = [];
		
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
		
		// TODO: you need to do a check against existing destination names first before
		// adding!
		map.on('dblclick', (evt) => {
			// add marker 
			// confirm if selection ok
			let addMarker = confirm("add this spot as a destination?");
			if(addMarker){
				let marker = new mapboxgl.Marker();
				marker.setLngLat([evt.lngLat.lng, evt.lngLat.lat])
				marker.addTo(map);
				
				// send info to parent
				const addDestEvent = new CustomEvent('addDest', {
					detail: {
						lng: evt.lngLat.lng, 
						lat: evt.lngLat.lat
					}
				});
				this.markers.push(marker);
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
	
	removeSingleMarker() : boolean {
		// TODO
		return true;
	}
	
	removeMarkers() : boolean {
		for(let marker of this.markers){
			marker.remove();
		}
		this.markers = [];
		return true;
	}
	
	updateMarkers(listOfDest : Array<Object>): void {
		for(let dest of listOfDest){
			let marker = new mapboxgl.Marker();
			marker.setLngLat([(dest as any).longitude, (dest as any).latitude]);
			marker.addTo(this.map);
			
			this.markers.push(marker);
		}
		
		this.drawLineBetweenMarkers();
	}
	
	drawLineBetweenMarkers(){
		
		if(this.map.getLayer('route')){
			this.map.removeLayer('route');
		}
		
		if(this.map.getSource('route')){
			this.map.removeSource('route');
		}
		
		let coordinates = this.markers.map(function(marker){
			let loc = marker.getLngLat();
			return [loc.lng, loc.lat];
		});
		
		this.map.addSource('route', {
			'type': 'geojson',
			'data': {
				'type': 'Feature',
				'properties': {},
				'geometry': {
					'type': 'LineString',
					'coordinates': coordinates
				}
			}
		});
		
		this.map.addLayer({
			'id': 'route',
			'type': 'line',
			'source': 'route',
			'layout': {
				'line-join': 'round',
				'line-cap': 'round'
			},
			'paint': {
				'line-color': '#888',
				'line-width': 8
			}
		});
	}

}

export {
	MapBoxWrapper
}