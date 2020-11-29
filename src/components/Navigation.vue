<template>
	<div id='menuHeader'>
		<h3 id="createNewTrip" class="selectOption"> new trip </h3>
		<h3> | </h3>
		
		<div class='dropdown'>
			<button class='dropbtn'> select trip </button>
			<div class='dropContent'>
				<a 
                   href="#"
                   v-for="(tripName, index) in listOfTripNames"
                   v-bind:key="tripName + '_' + index"
                   :id="'tripIndex_' + index"
				>
				{{tripName}}
				</a>
			</div>
		</div>

		<h3> | </h3>
		<h3 class="selectOption"> home </h3>
	</div>
</template>

<script lang="ts">
export default {
	props: {
		listOfTripNames: { required: true, type: Array }
	},
}
</script>

<style scoped>
#menuHeader{
	background-color: #32CD32;
	padding: 2px;
	padding-right: 5px;
	text-align: right;
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

.dropbtn {
	background-color: transparent;
	border: none;
	font-family: monospace;
	color: #000;
}

.dropbtn:hover {
	cursor: pointer;
	color: #fff;
}

.dropContent {
	display: none;
	position: absolute;
	z-index: 1;
	width: auto;
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