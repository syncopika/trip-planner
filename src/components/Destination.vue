<template>

	<!-- one li == one destination -->
	<li :id="name + '_dest'"
		class="dest"
		v-on:mouseover="highlightBorder"
		v-on:mouseleave="dehighlightBorder"
		v-on:click="toggleVisibility"
		>
		<h1> {{name}} </h1>
		
		<!-- notes section -->
		<div :id="name + '_notes'" class="notes">
			<ul>
				<li 
					v-for="note in notes" 
					v-bind:key="note + '_name'"
				>
					{{ note }}
				</li>
			</ul>
			
			<br />
		
			<p class='latitude'>lat: {{latitude}}</p>
			<p class='longitude'>long: {{longitude}}</p>
			
			<br />
			
			<button> edit </button>
		
		</div>
		
	</li>

</template>

<script lang="ts">
// get info passed from parent component (i.e. Sidebar)
export default {
	data(){
		return {
			expanded: false
		}
	},
	props: {
		name: {required: true, type: String},
		latitude: {required: true, type: Number},
		longitude: {required: true, type: Number},
		notes: {required: true, type: Array}
	},
	methods: {
		highlightBorder: function(){
			let name = (this as any).name;
			let dest = document.getElementById(name + '_dest');
			if(dest !== null){
				dest.style.border = '1px solid #fff';
			}
		},
		dehighlightBorder: function(){
			let name : any = (this as any).name;
			let dest = document.getElementById(name + '_dest');
			if(dest !== null){
				dest.style.border = '1px solid #000';
			}	
		},
		toggleVisibility: function(){
			let name : any = (this as any).name;
			let info = document.getElementById(name + '_notes');
			if(info !== null){
				if((this as any).expanded){
					info.style.display = "none";
				}else{
					info.style.display = "block";
				}
			}
			(this as any).expanded = !(this as any).expanded;
		}
	}
};
</script>

<style scoped>
	.dest {
		padding: 3px;
		border: 1px solid #000;
		border-radius: 15px;
		text-align: "center";
	}
	
	.notes {
		display: none;
	}
	
	button {
		padding: 4px;
		background-color: #6A5ACD;
		border-radius: 10px;
		border: 1px solid #483D8B;
		color: #fff;
	}

	ul{
		list-style-type: none;
		padding: 0;
	}

	li{
		margin: 0 10px 10px;
	}
</style>