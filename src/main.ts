import Vue from 'vue'
import App from './App.vue'
import { MapBoxWrapper } from './map'
import { addNewDestination } from './utils';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  mounted: () => {
	let mapbox = new MapBoxWrapper("", "map");
	//console.log(mapbox.getContainerId());

	let addDestButton = document.getElementById('addDest');
	if(addDestButton !== null){
		addDestButton.addEventListener('click', () => {
			let destName = prompt('enter destination name');
			if(destName !== null){
				addNewDestination('stops', destName);
			}
		});
	}

  }
}).$mount('#app')
