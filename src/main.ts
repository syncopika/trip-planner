import Vue from 'vue'
import App from './App.vue'
import { MapBoxWrapper } from './map'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  mounted: () => {
	let mapbox = new MapBoxWrapper("token goes here", "map");
	console.log(mapbox.getContainerId());
  }
}).$mount('#app')
