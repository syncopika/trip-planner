<template>

	<!-- one li == one destination -->
	<li :id="name + '_dest'"
		class="dest"
		v-on:mouseover="highlightBorder"
		v-on:mouseleave="dehighlightBorder"
		v-on:click="toggleVisibility"
		>

		<h1> {{name}} </h1>
		
		<div :id="name + '_content'" class="content">
		
			<!-- notes section -->
			<div :id="name + '_notes'">
				<h3> notes: </h3>
				<ul>
					<li 
						v-for="note in notes" 
						v-bind:key="note + '_name'"
					>
						{{ note }}
					</li>
				</ul>
				
				<br />
			</div>

			<hr />
			
			<p class='latitude'>lat: {{latitude}}</p>
			<p class='longitude'>long: {{longitude}}</p>
			
			<button v-on:click="toggleEdit"> edit </button>
			
			<button
				class="editButton"
				v-if="isEditing"
				v-on:click="saveChanges"
			> save </button>
			
		</div>
		
	</li>

</template>

<script lang="ts">
// get info passed from parent component (i.e. Sidebar)
export default {
	data(){
		return {
			expanded: false,
			isEditing: false
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
			let name = (this as any).name;
			let dest = document.getElementById(name + '_dest');
			if(dest !== null){
				dest.style.border = '1px solid #000';
			}	
		},
		toggleVisibility: function(){
			let name = (this as any).name;
			let content = document.getElementById(name + '_content');

			if(content !== null){
				if((this as any).expanded && !(this as any).isEditing){
					content.style.display = "none";
				}else{
					content.style.display = "block";
				}
			}

			(this as any).expanded = !(this as any).expanded;
		},
		toggleEdit: function(evt : any){
		
			// prevent div from closing
			evt.stopPropagation();
			
			let name = (this as any).name;
		
			// set flag
			(this as any).isEditing = true;
			
			// make content editable
			let notes = document.getElementById(name + '_notes');
			if(notes !== null) notes.setAttribute('contenteditable', 'true');
		},
		saveChanges: function(evt : any){
			
			evt.stopPropagation();
			
			let name = (this as any).name;
		
			// TODO: but what about cancelling unwanted edits!?
			let notes = document.getElementById(name + '_notes');
			if(notes !== null) notes.removeAttribute('contenteditable');

			// TODO: need to think about this a bit more. emit an event to update the destination
			// all the way in the root instance?
			
			(this as any).isEditing = false;
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

	.editButton {
		display: inline;
		margin-left: 2px;
	}
	
	.content {
		display: none;
	}
	
	h3 {
		text-align: left;
		margin-left: 3px;
	}
	
	span {
		color: #ff0000;
		font-weight: bold;
		display: inline;
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