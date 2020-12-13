// stuff for accessing map resources via mapbox's API
// https://docs.mapbox.com/mapbox-gl-js/api/

import mapboxgl, { Map, Marker, Popup } from 'mapbox-gl';
import { Destination } from '../src/triproute';

class MapBoxWrapper {
	key: 		  string;
	container:    HTMLElement;
	map:          Map;
	markers:      Array<Marker>;
	destNames:    Set<string>;
	
	constructor(key: string, mapContainer: HTMLElement) {
		this.key = key;
		this.container = mapContainer;
		this.markers = [];
		this.destNames = new Set();
		
		// get map data from MapBox API with key
		mapboxgl.accessToken = key;
		let map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [-77.04, 38.907],
			zoom: 10.00
		});
		
		// disable double-click zoom so we can configure double-click for adding a new destination
		map["doubleClickZoom"].disable();

		map.on('dblclick', (evt) => {
			// add marker 
			// confirm if selection ok
			let addMarker = confirm("add this spot as a destination?");
			if(addMarker){
				// get name of destination. make sure it's a new name not already used.
				let name = prompt("enter destination name");
				
				if(name && this.isUniqueDestName(name)){

					let data = {
						name: name,
						longitude: evt.lngLat.lng, 
						latitude: evt.lngLat.lat
					}

					let marker = this.addMarkerToMap(data);
					
					// send info to parent
					const addDestEvent = new CustomEvent('addDest', {
						detail: data
					});
					
					parent.document.dispatchEvent(addDestEvent);
					
					this.markers.push(marker);
					this.destNames.add(name);
				}else{
					alert('You already have a destination with the name: ' + name + '. Please choose a different name.');
				}
			}
		});

		map.addControl(new mapboxgl.NavigationControl());
		
		this.map = map;
	}
	
	getMap(): Map {
		return this.map;
	}
	
	getContainer(): HTMLElement {
		return this.container;
	}
	
	isUniqueDestName(name : string) {
		return !this.destNames.has(name);
	}
	
	addMarkerToMap(data : any){
		let newMarker = new mapboxgl.Marker();
		let popupContent = "";
		
		if(data.name){
			popupContent += "<h3>" + data.name + "</h3>";
		}

		if(data.fromDate){
			popupContent += "<p> from: " + data.fromDate + "</p>";
		}

		if(data.toDate){
			popupContent += "<p> to: " + data.toDate + "</p>";
        }
		
		if(data.longitude && data.latitude){
			newMarker.setLngLat([data.longitude, data.latitude]);
			popupContent += "<br />";
			popupContent += "<p> long: " + data.longitude + "</p>";
			popupContent += "<p> lat: " + data.latitude + "</p>";
		}
		
		if(popupContent){
			let popup = new mapboxgl.Popup({offset: 25});
			popup.setHTML(popupContent);
			newMarker.setPopup(popup);
		}
		
		newMarker.addTo(this.map);

		// center the map around the new marker
		this.map.flyTo({
			center: [data.longitude, data.latitude]
		});
		
		return newMarker;
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
		this.destNames.clear();
		return true;
	}
	
	updateMarkers(listOfDest : Array<Destination>): void {
		for(let dest of listOfDest){
			let marker = this.addMarkerToMap(dest);		
			this.destNames.add(dest.name);

			// add route color property to marker with route color
			// TODO: think of an alternative strategy?
			//@ts-ignore
			marker.routeColor = dest.routeColor;
			this.markers.push(marker);
		}
		
		this.drawLineBetweenMarkers();
	}
	
	drawLineBetweenMarkers() {

		// clear old lines first
		this.markers.forEach((marker, idx) => {
			let routeId = 'route' + idx;
			let sourceId = 'source' + idx;

			if(this.map.getLayer(routeId)) {
				this.map.removeLayer(routeId);
			}

			if(this.map.getSource(sourceId)) {
				this.map.removeSource(sourceId);
			}
		});

		for(let i = 0; i < this.markers.length - 1; i++) {

			let currDest = this.markers[i];
			let nextDest = this.markers[i + 1];

			let loc = currDest.getLngLat();
			let nextLoc = nextDest.getLngLat();

			let routeId = 'route' + i;
			let sourceId = 'source' + i;

			this.map.addSource(sourceId, {
				'type': 'geojson',
				'data': {
					'type': 'Feature',
					'properties': {},
					'geometry': {
						'type': 'LineString',
						'coordinates': [
							[loc.lng, loc.lat],
							[nextLoc.lng, nextLoc.lat]
						]
					}
				}
			});

			this.map.addLayer({
				'id': routeId,
				'type': 'line',
				'source': sourceId,
				'layout': {
					'line-join': 'round',
					'line-cap': 'round'
				},
				'paint': {
					//@ts-ignore - b/c I added a new property to Marker
					'line-color': currDest.routeColor,
					'line-width': 7
				}
			});
        }
	}

}

export {
	MapBoxWrapper
}