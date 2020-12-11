<template>
	<div id='menuHeader'>
		<h2> trip-planner </h2>
		<h3 id="createNewTrip"
			class="selectOption"
			v-on:click="addNewTrip">
			new trip
		</h3>

		<h3> | </h3>

		<div class='dropdown'>
			<h3 class='dropbtn'> select trip </h3>
			<div class='dropContent'>
				<a href="#"
					v-for="(tripName, index) in listOfTripNames"
					v-bind:key="tripName + '_' + index"
					v-on:click="selectTrip"
					:id="'tripIndex_' + index">
					{{tripName}}
				</a>
			</div>
		</div>

		<h3> | </h3>
		<h3 class="selectOption"> import </h3>

		<h3> | </h3>
		<h3 class="selectOption"> export </h3>

		<h3> | </h3>
		<h3 class="selectOption"> logout </h3>
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
			if (newTripName) {
				this.$root.addNewTrip(newTripName);
            }
		},
		selectTrip: function(evt: any): void {
			// TODO: event shouldn't be any?
			let index = parseInt(evt.target.id.split("_")[1]);
			this.$root.selectTrip(index);
        }
    }
}
</script>

<style scoped>
#menuHeader{
	background-color: #32CD32;
	padding: 2px;
	padding-right: 5px;
	text-align: right;
}

#menuHeader h2{
	text-align: left;
}

#menuHeader h3 {
	display: inline;
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