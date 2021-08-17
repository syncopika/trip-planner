// stuff for accessing map resources via mapbox's API
// https://docs.mapbox.com/mapbox-gl-js/api/

import mapboxgl, { Map, Marker, Popup } from 'mapbox-gl';
import { Modal } from '../src/modal';
import { Destination } from '../src/triproute';

class MapBoxWrapper {
	key: 		       string;
	container:         HTMLElement;
	map:               Map;
	markers:           Array<Marker>;
	suggestedNextHops: Array<Marker>;
	destNames:         Set<string>;
	
	constructor(key: string, mapContainer: HTMLElement) {
		this.key = key;
		this.container = mapContainer;
		this.markers = [];
		this.suggestedNextHops = [];
		this.destNames = new Set();
		
		// default style that doesn't require a mapbox key
		// https://docs.mapbox.com/mapbox-gl-js/example/map-tiles/
		let mapStyle: any = {
			'version': 8,
			'sources': {
				'raster-tiles': {
					'type': 'raster',
					'tiles': [
						'https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg'
					],
					'tileSize': 256,
					'attribution': 'Map tiles by <a target="_top" rel="noopener" href="http://stamen.com">Stamen Design</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
				}
			},
			'layers': [
				{
					'id': 'simple-tiles',
					'type': 'raster',
					'source': 'raster-tiles',
					'minzoom': 0,
					'maxzoom': 22
				}
			]
		};
		
		if(key.length > 0){
			// get map data from MapBox API with key
			mapboxgl.accessToken = key;
			mapStyle = 'mapbox://styles/mapbox/streets-v11';
		}
		
		const map = new mapboxgl.Map({
			container: mapContainer,
			style: mapStyle,
			center: [-77.04, 38.907],
			zoom: 10.00
		});
		
		// disable double-click zoom so we can configure double-click for adding a new destination
		map["doubleClickZoom"].disable();

		map.on('dblclick', async (evt) => {
			// add marker 
			// confirm if selection ok
			const modal = new Modal();
			const addMarker = await modal.createQuestionModal("add this spot as a destination?");
			if(addMarker){
				// get name of destination. make sure it's a new name not already used.
				const name = await modal.createInputModal("enter destination name");
				
				if(name && this.isUniqueDestName(name)){
					const data = {
						name: name,
						longitude: evt.lngLat.lng, 
						latitude: evt.lngLat.lat
					}

					const marker = this.addMarkerToMap(data); // TODO: why not just add the marker to this.markers within the method?
					
					// send info to parent to add new destination to destination list
					const addDestEvent = new CustomEvent('addDest', {
						detail: data
					});
					
					parent.document.dispatchEvent(addDestEvent);
					
					this.markers.push(marker);
					this.destNames.add(name);
				}else if(!this.isUniqueDestName(name)){
					await modal.createMessageModal('You already have a destination with the name: ' + name + '. Please choose a different name.');
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
	
	isUniqueDestName(name: string) {
		return !this.destNames.has(name);
	}
	
	addMarkerToMap(data: any) {
		const newMarker = new mapboxgl.Marker();
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
			const popup = new mapboxgl.Popup({offset: 25});
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
	
	removeSingleMarker(): boolean {
		// TODO: is this needed?
		return true;
	}
	
	removeMarkers(): boolean {
		this.clearLines();
		for(let marker of this.markers){
			marker.remove();
		}

		for(let marker of this.suggestedNextHops) {
			marker.remove();
		}
		this.suggestedNextHops = [];
		this.markers = [];
		this.destNames.clear();
		return true;
	}
	
	clearLines() {
		this.markers.forEach((marker, idx) => {
			const routeId = 'route' + idx;
			const sourceId = 'source' + idx;

			if(this.map.getLayer(routeId)) {
				this.map.removeLayer(routeId);
			}

			if(this.map.getSource(sourceId)) {
				this.map.removeSource(sourceId);
			}
		});
	}
	
	updateMarkers(listOfDest : Array<Destination>): void {
		this.clearLines();
		
		for(let dest of listOfDest){
			const marker = this.addMarkerToMap(dest);		
			this.destNames.add(dest.name);

			// add route color property to marker with route color
			// TODO: think of an alternative strategy?
			//@ts-ignore b/c I added a new property to Marker
			marker.routeColor = dest.routeColor;
			this.markers.push(marker);
		}
		
		this.drawLineBetweenMarkers();
	}

	showSuggestedNextHops(listOfLocations: Array<any>): void {
		// clear first
		for(let marker of this.suggestedNextHops) {
			marker.remove();
		}

		// show markers for suggested next hops
		for(let dest of listOfLocations){
			// make sure to denote these markers in a different way from the user's actual destination markers
			const newMarker = new mapboxgl.Marker({ color: "#B22222"}); // brickred marker

			let popupContent = "";

			if(dest.destname) {
				popupContent += "<h3>" + dest.destname + "</h3>";
			}

			if(dest.longitude && dest.latitude) {
				newMarker.setLngLat([parseFloat(dest.longitude), parseFloat(dest.latitude)]);
				popupContent += "<br />";
				popupContent += "<p> long: " + dest.longitude + "</p>";
				popupContent += "<p> lat: " + dest.latitude + "</p>";
			}

			if(popupContent) {
				const popup = new mapboxgl.Popup({ offset: 25 });
				popup.setHTML(popupContent);
				newMarker.setPopup(popup);
			}

			this.suggestedNextHops.push(newMarker);
			newMarker.addTo(this.map);
        }
    }

	drawLineBetweenMarkers() {
		for(let i = 0; i < this.markers.length - 1; i++) {
			const currDest = this.markers[i];
			const nextDest = this.markers[i + 1];

			const loc = currDest.getLngLat();
			const nextLoc = nextDest.getLngLat();

			const routeId = 'route' + i;
			const sourceId = 'source' + i;

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
					//@ts-ignore - b/c I added a new property to Marker - is there a better way to do this?
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