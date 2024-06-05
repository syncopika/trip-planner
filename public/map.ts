// stuff for accessing map resources via mapbox's API
// https://docs.mapbox.com/mapbox-gl-js/api/

import mapboxgl, { Map, Marker, Popup } from 'mapbox-gl';
import { Modal } from '../src/utils/modal';
import {
    Destination,
    DestinationSuggestion,
    UserDestinationSuggestion,
    OverpassAPIDestinationSuggestion
} from '../src/utils/triproute';

class MapBoxWrapper {
    key:               string;
    container:         HTMLElement;
    map:               Map;
    markers:           Array<Marker>;
    suggestedNextHops: Array<Marker>;
    searchResults:     Array<Marker>;
    destNames:         Set<string>;
    
    constructor(key: string, mapContainer: HTMLElement){
        this.key = key;
        this.container = mapContainer;
        this.markers = [];
        this.suggestedNextHops = [];
        this.searchResults = [];
        this.destNames = new Set();
        
        // default style that doesn't require a mapbox key
        // https://docs.mapbox.com/mapbox-gl-js/example/map-tiles/
        let mapStyle: any = {
            'version': 8,
            'sources': {
                'raster-tiles': {
                    'type': 'raster',
                    'tiles': [
                        'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                    ],
                    'tileSize': 256,
                    'attribution': '© <a href="https://www.openstreetmap.org/copyright"> OpenStreetMap contributors </a>'
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
            const modal = new Modal();
            const addMarker = await modal.createQuestionModal("add this spot as a destination?");
            if(addMarker) this.addMarker(evt.lngLat.lat, evt.lngLat.lng);
        });

        // support doubletap on mobile for double-click
        let tapped: number = -1;
        map.on('touchstart', async (evt) => {
            if(tapped === -1){
                tapped = window.setTimeout(() => {
                    tapped = -1;
                }, 300);
            }else{
                window.clearTimeout(tapped);
                tapped = -1;

                // double-tap occurred
                const modal = new Modal();
                const addMarker = await modal.createQuestionModal("add this spot as a destination?");
                if(addMarker) this.addMarker(evt.lngLat.lat, evt.lngLat.lng);
            }
        });

        map.addControl(new mapboxgl.NavigationControl());
        
        this.map = map;
    }
    
    async addMarker(latitude: number, longitude: number): void {
        // get name of destination. make sure it's a new name not already used.
        const modal = new Modal();
        const name = await modal.createInputModal("enter destination name");
        
        if(name && this.isUniqueDestName(name)){
            const data = {
                name,
                longitude,
                latitude,
            };

            const marker = this.addMarkerToMap(data); // TODO: why not just add the marker to this.markers within the method?
            
            // send info to parent to add new destination to destination list
            const addDestEvent = new CustomEvent('addDest', {
                detail: data
            });
            
            parent.document.dispatchEvent(addDestEvent);
            
            this.markers.push(marker);
            this.destNames.add(name);
        }else if(!this.isUniqueDestName(name)){
            await modal.createMessageModal(`You already have a destination with the name: ${name}. Please choose a different name.`);
        }
    }
    
    getMap(): Map {
        return this.map;
    }
    
    // TODO: need new map options because https://maps.stamen.com/stadia-partnership/
    changeMapStyle(mapType: string): void {
        // maybe helpful? https://github.com/mapbox/mapbox-gl-js/issues/2941
        const currStyle = this.map.getStyle() as any;  // TODO: don't use any?
        if(currStyle === null){
            return;
        }
        
        let newMapType = 'https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg';

        if(mapType === "toner"){
            newMapType = 'https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png';
        }else if(mapType === "terrain"){
            newMapType = 'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg';
        }
        
        currStyle.sources["raster-tiles"].tiles = [newMapType];
        this.map.setStyle(currStyle);
    }
    
    getContainer(): HTMLElement {
        return this.container;
    }
    
    isUniqueDestName(name: string): boolean {
        return !this.destNames.has(name);
    }
    
    addMarkerToMap(data: any): mapboxgl.Marker {
        const options: any = {};
        if(data.routeColor){
            options.color = data.routeColor;
        }
        
        const newMarker = new mapboxgl.Marker(options);
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
    
    removeMarkers(): boolean {
        this.clearLines();
        for(let marker of this.markers){
            marker.remove();
        }

        // TODO: make separate method
        for(let marker of this.suggestedNextHops){
            marker.remove();
        }
        this.suggestedNextHops = [];
        
        this.markers = [];
        this.destNames.clear();
        return true;
    }
    
    clearLines(): void {
        this.markers.forEach((marker, idx) => {
            const routeId = 'route' + idx;
            const sourceId = 'source' + idx;

            if(this.map.getLayer(routeId)){
                this.map.removeLayer(routeId);
            }

            if(this.map.getSource(sourceId)){
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
    }
    
    // https://stackoverflow.com/questions/37599561/drawing-a-circle-with-the-radius-in-miles-meters-with-mapbox-gl-js
    // center should be an array of longitude, latitude values representing the center of the polygon
    // radius should be in km
    generateGeoJSONCircle(center: Array<number>, radius: number): any { // TODO: don't return any
        const numPoints = 64;
        const lng = center[0];
        const lat = center[1];
        
        const points = [];
        const distX = radius / (111.320*Math.cos((lat*Math.PI)/180)); // 1 deg latitude == 111.320 km
        const distY = radius / 110.574;                               // 1 deg longitude == 110.574 km
        
        for(let i = 0; i < numPoints; i++){
            const degSlice = (i/numPoints)*(2*Math.PI); // fraction of 360 deg in rads
            const xPos = Math.cos(degSlice) * distX;
            const yPos = Math.sin(degSlice) * distY;
            points.push([lng + xPos, lat + yPos]);
        }
        // close up the circle by adding the first point again
        points.push(points[0]);
        
        return {
            type: "geojson",
            data: {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [points]
                    }
                }],
            },
        };
    }
    
    removeSuggestedDestCircle(): void {
        // layer needs to be removed before the source it's using
        if(this.map.getLayer("suggestedNextDestCircleLayer")){
            this.map.removeLayer("suggestedNextDestCircleLayer");
        }
        
        if(this.map.getSource("suggestedNextDestCircle")){
            this.map.removeSource("suggestedNextDestCircle");
        }
    }

    appendTextToMarker(container: HTMLDivElement, textContent: string): void {
        const paragraphElement = document.createElement("p");
        paragraphElement.textContent = textContent;
        container.appendChild(paragraphElement);
    }

    showSuggestedNextHops(listOfLocations: Array<DestinationSuggestion | UserDestinationSuggestion | OverpassAPIDestinationSuggestion>): void {
        // clear first
        for(let marker of this.suggestedNextHops){
            marker.remove();
        }
        
       this.removeSuggestedDestCircle();

        // show markers for suggested next hops
        for(let dest of listOfLocations){
            // make sure to denote these markers in a different way from the user's actual destination markers
            const newMarker = new mapboxgl.Marker({color: "#B22222"}); // brickred marker

            const popupContent = document.createElement("div");

            if(dest.destname) {
                const destName = document.createElement("h3");
                destName.textContent = dest.destname;
                popupContent.appendChild(destName);
            }

            if('website' in dest && dest.website){
                popupContent.appendChild(document.createElement("br"));
                this.appendTextToMarker(popupContent, `website: ${dest.website}`);
            }

            if(dest.longitude && dest.latitude) {
                newMarker.setLngLat([dest.longitude, dest.latitude]);
                popupContent.appendChild(document.createElement("br"));
                
                this.appendTextToMarker(popupContent, `longitude: ${dest.longitude}`);
                this.appendTextToMarker(popupContent, `latitude: ${dest.latitude}`);
                
                // make each suggested next destination selectable as a next destination by the user
                const selectBtn = document.createElement("button");
                selectBtn.textContent = "select as next destination?";
                popupContent.appendChild(selectBtn);
                
                selectBtn.addEventListener("click", () => {
                    this.addMarker(dest.latitude, dest.longitude);
                });
            }

            const popup = new mapboxgl.Popup({ offset: 25 });
            popup.setDOMContent(popupContent);
            newMarker.setPopup(popup);

            this.suggestedNextHops.push(newMarker);
            newMarker.addTo(this.map);
        }
        
        // show circle indicating the area that includes the suggested next hops based on
        // the current last destination marker location
        if(listOfLocations.length > 0){
            const lastDest = this.markers[this.markers.length-1];
            const lastDestLoc = lastDest.getLngLat();

            this.map.addSource(
                "suggestedNextDestCircle",
                this.generateGeoJSONCircle([lastDestLoc.lng, lastDestLoc.lat], 20) // radius of 20km
            );

            this.map.addLayer({
                "id": "suggestedNextDestCircleLayer",
                "type": "fill",
                "source": "suggestedNextDestCircle",
                "layout": {
                    "visibility": "visible"
                },
                "paint": {
                    "fill-color": "#7fbbf1", // light blue
                    "fill-opacity": 0.6
                }
            });
        }
    }
    
    showSearchResults(listOfLocations: Array<OverpassAPIDestinationSuggestion>): void {
        for(let marker of this.searchResults){
            marker.remove();
        }
        
        this.searchResults = [];
        
        for(let dest of listOfLocations){
            // make sure to denote these markers in a different way from the user's actual destination markers
            const newMarker = new mapboxgl.Marker({color: "#2ad156"}); // green marker

            const popupContent = document.createElement("div");

            if(dest.destname) {
                const destName = document.createElement("h3");
                destName.textContent = dest.destname;
                popupContent.appendChild(destName);
            }

            if('website' in dest && dest.website){
                popupContent.appendChild(document.createElement("br"));
                this.appendTextToMarker(popupContent, `website: ${dest.website}`);
            }

            if(dest.longitude && dest.latitude) {
                newMarker.setLngLat([dest.longitude, dest.latitude]);
                popupContent.appendChild(document.createElement("br"));
                
                this.appendTextToMarker(popupContent, `longitude: ${dest.longitude}`);
                this.appendTextToMarker(popupContent, `latitude: ${dest.latitude}`);
                
                // make each suggested next destination selectable as a next destination by the user
                const selectBtn = document.createElement("button");
                selectBtn.textContent = "select as next destination?";
                popupContent.appendChild(selectBtn);
                
                selectBtn.addEventListener("click", () => {
                    this.addMarker(dest.latitude, dest.longitude);
                });
            }

            const popup = new mapboxgl.Popup({ offset: 25 });
            popup.setDOMContent(popupContent);
            newMarker.setPopup(popup);
            newMarker.addTo(this.map);
            
            this.searchResults.push(newMarker);
        }
    }
    
    clearSearchResults(): void {
        for(let marker of this.searchResults){
            marker.remove();
        }
        this.searchResults = [];
    }
    
    drawLineBetweenMarkers(): void {
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
    
    createMarkerPopup(){
        // TODO -  this should return an html node containing
        // all the stuff in a marker popup
        // we can then pass it to marker.setDOMContent
    }

}

export {
    MapBoxWrapper
}