<template>

	<!-- one li == one destination -->
	<li :id="destination.name + '_dest'"
		class="dest"
		v-on:mouseover="highlightBorder"
		v-on:mouseleave="dehighlightBorder"
		>

		<h1 v-on:click="toggleVisibility"> {{destination.name}} </h1>
		
		<div :id="destination.name + '_content'" class="content">
		
			<!-- notes section -->
			<h3> notes: </h3>
			<div :id="destination.name + '_notes'">
				<ul :id="destination.name + '_notes_content'">
					<li 
						v-for="(note, index) in destination.notes" 
						v-bind:key="note + '_name' + index"
						:class="note + '_name'"
					>
						{{ note }} - this is a test
					</li>
				</ul>
				
				<br />
			</div>

			<hr />
			
			<p class='latitude'> lat: {{destination.latitude}} </p>
			<p class='longitude'> long: {{destination.longitude}} </p>
			
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

import { Destination } from '../triproute';

// get info passed from parent component (i.e. Sidebar)
export default {
	data(){
		return {
			expanded: false,
			isEditing: false
		}
	},
	props: {
		destination: {required: true, type: Object}
	},
	methods: {
		highlightBorder: function(){
			let name = (this as any).destination.name;
			let dest = document.getElementById(name + '_dest');
			if(dest !== null){
				dest.style.border = '1px solid #fff';
			}
		},
		dehighlightBorder: function(){
			let name = (this as any).destination.name;
			let dest = document.getElementById(name + '_dest');
			if(dest !== null){
				dest.style.border = '1px solid #000';
			}	
		},
		toggleVisibility: function(){
			let name = (this as any).destination.name;
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
			
			let name = (this as any).destination.name;
		
			// set flag
			(this as any).isEditing = true;
			
			// make content editable
			let notes = document.getElementById(name + '_notes_content');
			if(notes !== null) notes.setAttribute('contenteditable', 'true');
		},
		removeDestination: function(){
			// TODO: remove a destination.
			// emit an event to the root instance to make sure the destination is removed from the list.
			// or should this be done at the Sidebar component level? you can also reorder
			// destinations there too.
		},
		saveChanges: function(evt : any){
			
			evt.stopPropagation();
			
			let name = (this as any).destination.name;
			
			// TODO: but what about cancelling unwanted edits!?
			let notes = document.getElementById(name + '_notes_content');
			if(notes !== null) notes.removeAttribute('contenteditable');

			let data : Destination = JSON.parse(JSON.stringify((this as any).destination));
			data.notes = [];
			
			// get all notes
			let currNotes = document.getElementById((this as any).destination.name + '_notes_content');
			if(currNotes !== null){
				for(let child of currNotes.children){
					data.notes.push(child.textContent.trim());
				}
			}
			
			// if text was edited, throw out the newly added <li> elements, if any?
			// save state when edit button is clicked. when save is clicked, compare current state (i.e. child nodes) with saved??
			// since it looks like li elements get class names cloned so that doesn't help
			
			
			// update data source with new info
			//this.$root.$emit('update-destination', data);
			this.$root.updateDestination(data);
			
			
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

	ul {
		list-style-type: none;
		padding: 0;
	}

	li {
		margin: 0 10px 10px;
		color: #000;
	}
</style>