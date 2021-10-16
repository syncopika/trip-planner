<template>
	<div id='menuHeader'>
		<h2> trip-planner </h2>
		<ul>
			<li id="createNewTrip"
				class="selectOption"
				v-on:click="addNewTrip"
			>
				new trip
			</li>

			<li> • </li>
			<li class='dropdown'>
				<p class='dropbtn'> select trip </p>
				<div class='dropContent'>
					<a 
						href="#"
						:id="'tripIndex_' + index"
						v-for="(tripName, index) in listOfTripNames"
						v-bind:key="tripName + '_' + index"
						@click="selectTrip"
					>
						{{tripName}}
					</a>
				</div>
			</li>

			<li> • </li>
			<li class="selectOption" @click="triggerImport"> import </li>
			<input type='file' @change="importData" id='importTripData'>

			<li> • </li>
			<li class="selectOption" @click="exportData"> export </li>

			<!-- TODO 
			
			<li> • </li>
			<li class="" @click="saveData"> save </li>

			<li> • </li>
			<li class=""> logout </li>
			
			-->
		</ul>
	</div>
</template>

<script lang="ts">
import { Modal } from "../utils/modal";

export default {
	props: {
		listOfTripNames: { required: true, type: Array }
	},
	methods: {
		addNewTrip: async function(): Promise<void> {
			const modalHandler = new Modal();
			const newTripName = await modalHandler.createInputModal("please enter the name of the new trip:");
			
			if(newTripName) {
				//@ts-ignore (TS-2339)
				this.$root.addNewTrip(newTripName);
			}
		},
		
		selectTrip: function(evt: MouseEvent): void {
			if(evt){
				const index = parseInt((evt.target as HTMLParagraphElement).id.split("_")[1]);
				// @ts-ignore (TS-2339)
				this.$root.selectTrip(index);
			}
		},
		
		triggerImport: function(): void {
			const importButton = document.getElementById('importTripData');
			importButton?.click();
		},
		
		importData: function(evt: MouseEvent): void {
			// call root to import data
			// @ts-ignore
			this.$root.importData(evt);
		},
		
		exportData: function(): void {
			// call root to download trip data
			// @ts-ignore
			this.$root.exportData();
		},
		
		saveData: function(): void {
			// TODO: save current trip data to database
		}
	}
}
</script>

<style scoped>
#menuHeader {
    background-color: #F9F4E1;
    padding: 2px;
    padding-right: 5px;
    text-align: right;
}

#menuHeader h2{
	text-align: left;
}

#menuHeader p {
	display: inline;
}

#importTripData {
	display: none;
}

.selectOption:hover {
	color: #aaabbb;
	cursor: pointer;
}

.dropbtn:hover {
	cursor: pointer;
	color: #aaabbb;
}

.dropContent {
    display: none;
    position: absolute;
    z-index: 1;
    white-space: nowrap;
}

.dropContent a {
	padding: 2px 5px;
	text-decoration: none;
	display: block;
	border-bottom: 1px solid #000;
	font-size: 1.5em;
	background-color: #fff;
	color: #000;
	text-align: center;
}

.dropContent a:hover { background-color: #ddd}

.dropdown:hover .dropContent { 
	display: block;
	cursor: pointer;
}

ul {
	display: table;
	width: 100%;
}

ul li {
	display: table-cell;
	text-align: center;
}
</style>