<template>

	<div id='main'>
	
		<!-- the map and recommended destinations -->
		<div id='column1'>
			<div id='map' style="height:600px; height:800px">
			</div>
			
			<div id='suggestions'>
				<h2> suggestions for next dest in trip route go here </h2>
				<h3> other users have chosen these destinations next! </h3>
				<ul>
					<li> place 1 </li>
					<li> place 2 </li>
				</ul>
			</div>
		</div>
		
		<!-- show menu, route list -->
		<div id='column2'>
			<div id='menuHeader'>
				<!-- menu stuff goes here -->
				<h1> i'm a menu bar </h1>
			</div>
			<div id='tripInfo'>
				<h2 id='tripTitle'> [name of this trip goes here] 
					<span>
						<button id='addDest'> add destination </button>
					</span>
				</h2>
				<hr />
				<ul id='stops'>
				</ul>
			</div>
			
			<!-- https://developer.mozilla.org/en-US/docs/Web/CSS/Layout_cookbook/Sticky_footers -->
			<div id='footer'>
				<p> footer </p>
			</div>
		</div>

	</div>

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';


@Component
export default class TripRouteMap extends Vue {}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

h2{
	padding: 5px;
	margin: 0;
}

#main{
	display: flex;
	flex-direction: row;
	font-family: monospace;
	background-color: black;
}

#map{
	text-align: center;
	border-top: 1px solid #000;
	border-left: 1px solid #000;
	border-bottom: 1px solid #000;
	height: auto;
}

#suggestions{
	border-bottom: 1px solid #000;
	border-left: 1px solid #000;
	height: auto;
}

#column1{
	flex: 3;
	background-color: #fff;
}

#column2{
	flex: 1;
	border: 1px solid #000;
	background-color: #fff;
}

#menuHeader{
	background-color: green;
	padding: 2px;
}

#tripInfo{
	background-color: gray;
	border-bottom: 1px solid #000;
}

ul{
  list-style-type: none;
  padding: 0;
}

li{
  margin: 0 10px 10px;
  font-size: 20px;
}

a{
  color: #42b983;
}
</style>