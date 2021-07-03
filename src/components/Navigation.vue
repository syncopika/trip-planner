<template>
	<div id='menuHeader'>
		<h2> trip-planner </h2>
		<p id="createNewTrip"
			class="selectOption"
			v-on:click="addNewTrip"
		>
			new trip
		</p>

		<p> | </p>

		<div class='dropdown'>
			<p class='dropbtn'> select trip </p>
			<div class='dropContent'>
				<a href="#"
                   :id="'tripIndex_' + index"
                   v-for="(tripName, index) in listOfTripNames"
                   v-bind:key="tripName + '_' + index"
                   @click="selectTrip"
				>
					{{tripName}}
				</a>
			</div>
		</div>

		<p> | </p>
		<p class="selectOption" @click="triggerImport"> import </p>
		<input type='file' @change="importData" id='importTripData'>

		<p> | </p>
		<p class="selectOption" @click="exportData"> export </p>

		<p> | </p>
		<p class="" @click="saveData"> save </p>

		<p> | </p>
		<p class=""> logout </p>
	</div>
</template>

<script lang="ts">
export default {
	props: {
		listOfTripNames: { required: true, type: Array }
	},
	methods: {
		addNewTrip: function(): void {
			let newTripName = prompt("Please enter the name of the new trip:");
			if(newTripName) {
				//@ts-ignore (TS-2339)
				this.$root.addNewTrip(newTripName);
			}
		},
		
		selectTrip: function(evt: any): void {
			let index = parseInt(evt.target.id.split("_")[1]);
			// @ts-ignore (TS-2339)
			this.$root.selectTrip(index);
		},
		
		triggerImport: function(): void {
			document.getElementById('importTripData')!.click();
		},
		
		importData: function(evt: any): void {
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
	color: #ffffff;
	cursor: pointer;
}

.dropdown {
	position: relative;
	display: inline-block;
}

.dropbtn:hover {
	cursor: pointer;
	color: #fff;
}

.dropContent {
    display: none;
    position: absolute;
    z-index: 1;
    white-space: nowrap;
	border-radius: 25px;
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
</style>