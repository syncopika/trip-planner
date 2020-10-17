<template>

	<div>
		<ul>
			<!-- each list element is a destination -->
			<destination 
				v-for="dest in listOfDest" 
				v-bind:key="dest.name+dest.latitude+dest.longitude"
				:name="dest.name"
				:latitude="dest.latitude"
				:longitude="dest.longitude"
				:notes="dest.notes"
			></destination>
		</ul>
	
	</div>

</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Destination from './Destination.vue';

@Component({
	components: {
		Destination
	}
})

export default class Sidebar extends Vue {
	@Prop({required: true}) public listOfDest!: Array<Object>;
}
</script>