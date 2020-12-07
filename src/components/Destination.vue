<template>
	<!-- one li is one destination -->
	<li :id="destination.name + '_dest'"
		class="dest"
		v-on:mouseover="highlightBorder"
		v-on:mouseleave="dehighlightBorder"
		>

		<!-- name of destination -->
		<h1 :id="destination.name" v-on:click="toggleVisibility"> 
			{{destination.name}} 
		</h1>
		<p 
			:id="destination.name + '_delete'"
			v-on:click="removeDestination"
			class="delete"
		> x </p>
		
		<div :id="destination.name + '_content'" class="content">
			<!-- show from/to dates -->
			<div :id="destination.name + '_dates'" class="row">
				<div class="col">
					<h3>from: {{destination.fromDate}}</h3>
				</div>
				<div class="col">
					<h3>to: {{destination.toDate}}</h3>
				</div>
			</div>
			<!-- notes section -->
			<h3> notes: </h3>
			<div>
				<textarea :value="destination.notes" :id="destination.name + '_notes'" rows="5" cols="33" disabled>
				</textarea>
				<br />
			</div>

			<br />
			<div :id="destination.name + '_images'">
			</div>

			<hr />

			<p class='latitude'> lat: {{destination.latitude}} </p>
			<p class='longitude'> long: {{destination.longitude}} </p>

			<button v-on:click="toggleEdit"> edit </button>

			<input type="file" accept="image/*" :id="destination.name + '_importImage'" @change="uploadImage">
			<button v-on:click="clickInput"> upload image </button>

			<button class="editButton"
					v-if="isEditing"
					v-on:click="saveChanges">
				save
			</button>
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
			isEditing: false,
			currDestTitle: ""
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
				dest.style.border = '2px solid #fff';
			}
		},
		dehighlightBorder: function(){
			let name = (this as any).destination.name;
			let dest = document.getElementById(name + '_dest');
			if(dest !== null){
				dest.style.border = '2px solid #000';
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
			
			// make destination name editable
			// note: when save is clicked and the data is sent to the root
			// to update state, the destination name, if edited, will be
			// checked to make sure its new desired name is not already taken
			// by another destination
			let destTitle = document.getElementById(name);
			destTitle.setAttribute('contenteditable', "true");

			// save the current title so we can restore it if it can't be changed
            (this as any).currDestTitle = destTitle.textContent;

			// make content editable
			let notes = document.getElementById(name + '_notes');
			if(notes !== null) notes.removeAttribute('disabled');
			
		},
		removeDestination: function(evt : any){
			// remove a destination
			// calls a method of the Vue root instance
			let remove = confirm("Are you sure you want to remove this destination?");
			if (remove) {
				let name = evt.target.id.split("_")[0]; // i.e. name_dest, and we want name
				this.$root.removeDestination(name);
			}
		},
		saveChanges: function(evt : any){
			
			evt.stopPropagation();

			let name = (this as any).destination.name;
            let destTitle = document.getElementById(name);
			let newName = destTitle.textContent.trim().split(' ')[0];
			
			// make destination name not editable
            destTitle.setAttribute('contenteditable', "false");
			
			// TODO: but what about cancelling unwanted edits!?
			let notes = document.getElementById(name + '_notes');
			if(notes !== null) notes.setAttribute('disabled', 'true');

			let data : Destination = JSON.parse(JSON.stringify((this as any).destination));
			data.notes = notes.value;
			data.newName = newName;
			
			//console.log(data);

			// if new name is valid, the change will happen
			// if it doesn't happen, we'll at least have restored the title to its original
            destTitle.textContent = (this as any).currDestTitle;
			
			// update data source with new info
			this.$root.updateDestination(data);
			
			(this as any).isEditing = false;
		},
		uploadImage: function(evt: any){
            let img = new Image();
            let reader = new FileReader();
			let file = evt.target.files[0];

            //when the image loads, put it in the image section of the destination
			img.onload = () => {
				// adjust size of image
				img.style.height = "15%";
				img.style.width = "15%";
				img.style.border = "1px solid #000";
				img.style.display = "inline-block";
				let imageContainer = document.getElementById((this as any).destination.name + "_images");
				imageContainer.appendChild(img);
            };
            //after reader has loaded file, put the data in the image object.
            reader.onloadend = () => {
                img.src = reader.result;
            };
            //read the file as a URL
            reader.readAsDataURL(file);
		},
		clickInput: function () {
			let inputElement = document.getElementById((this as any).destination.name + "_importImage");
            inputElement.click();
        }
	}
};
</script>

<style scoped>
	.dest {
		padding: 3px;
		border: 2px solid #000;
		border-radius: 15px;
		text-align: "center";
	}
	
	.content {
		display: none;
	}

	.row {
		display: flex;
	}

	.col {
		flex: 50%;
	}

	input {
		display: none;
	}
	
	textarea {
		background-color: transparent;
		color: #000;
	}
	
	h3 {
		text-align: left;
		margin-left: 3px;
	}
	
	h1 {
		display: inline;
	}
	
	.delete {
		color: #8b0000;
		font-weight: bold;
		display: inline;
		font-size: 2em;
	}

    button {
        padding: 4px;
        background-color: #6A5ACD;
        border-radius: 10px;
        border: 1px solid #483D8B;
        color: #fff;
        display: inline;
        margin-left: 2px;
        margin-right: 2px;
    }

	ul {
		list-style-type: none;
		padding: 0;
	}

	li {
		margin: 0 10px 10px;
		color: #000;
		background-color: #888;
	}
</style>