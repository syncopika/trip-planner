import Vue from 'vue'
import App from './App.vue'
import { addNewDestination } from './utils';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  mounted: () => {
	
	// listen for custom events from the iframe (which is the map)
	document.addEventListener('addDest', (evt: Event) => {
		console.log(evt);
		let location = (<CustomEvent>evt).detail;
		let destName = prompt('enter destination name');
		if(destName !== null){
			addNewDestination('stops', destName, location);
		}
	});

  }
}).$mount('#app')
