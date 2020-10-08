// code for setting up the mapbox in the iframe
// eventually you'll want to set up some code so that
// when a certain action happens in the iframe, you can let the parent document know.

import { MapBoxWrapper } from './map';

let mapContainer : HTMLElement = document.getElementById('map') as HTMLElement;

// beware of secrets!! also know that it will show up in the resulting bundle file!!
let mapbox = new MapBoxWrapper("<your token here>", mapContainer);
