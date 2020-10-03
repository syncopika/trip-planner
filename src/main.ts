import Vue from 'vue'
import App from './App.vue'
import { MapBoxWrapper } from './map'
import { addNewDestination } from './utils';

Vue.config.productionTip = false

// env variables! https://stackoverflow.com/questions/50828904/using-environment-variables-with-vue-js
// use them for secrets like for the MapBox API

new Vue({
  render: h => h(App),
  mounted: () => {
	//let mapbox = new MapBoxWrapper("token goes here", "map");
	//console.log(mapbox.getContainerId());

	document.getElementById('addDest').addEventListener('click', () => {
		let destName = prompt('enter destination name');
		addNewDestination('stops', destName);
	});

  }
}).$mount('#app')
