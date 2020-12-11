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
					<h3>from: </h3>
					<Calendar
						:dest-name="destination.name + '_from_'"
						:date="destination.fromDate"
						:is-editing="isEditing"
					></Calendar>
				</div>
				<div class="col">
					<h3>to: </h3>
					<Calendar
						:dest-name="destination.name + '_to_'"
						:date="destination.toDate"
						:is-editing="isEditing">
					</Calendar>
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
				<img 
					v-for="(image, index) in destination.images"
					v-bind:key="destination.name + '_image_' + index"
					:src="image"
					@dblclick="enlargeImage($event)" />
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

			<button class="editButton"
					v-if="isEditing"
					v-on:click="cancelChanges">
				cancel
			</button>

		</div>
	</li>
</template>

<script lang="ts">

import { Destination } from '../triproute';
import Calendar from './Calendar.vue';

// get info passed from parent component (i.e. Sidebar)
export default {
	data(){
		return {
			expanded: false,
			isEditing: false,
			currDestTitle: ""
		}
	},
	components: {
		Calendar
	},
	props: {
		destination: {required: true, type: Object}
	},
	methods: {
		highlightBorder: function(): void {
			let name = (this as any).destination.name;
			let dest = document.getElementById(name + '_dest');
			if(dest !== null){
				dest.style.border = '2px solid #fff';
			}
		},
        dehighlightBorder: function(): void {
			let name = (this as any).destination.name;
			let dest = document.getElementById(name + '_dest');
			if(dest !== null){
				dest.style.border = '2px solid #000';
			}	
		},
        toggleVisibility: function(): void {
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
        toggleEdit: function(evt: any): void{
		
			// prevent div from closing
			evt.stopPropagation();
			
			let name = (this as any).destination.name;
		
			// set flag
			(this as any).isEditing = true;
			
			// make destination name editable
			let destTitle = document.getElementById(name);
			destTitle?.setAttribute('contenteditable', "true");

			// save the current title so we can restore it if it can't be changed
			(this as any).currDestTitle = destTitle?.textContent;

			// make content editable
			let notes = document.getElementById(name + '_notes');
			if(notes !== null) notes.removeAttribute('disabled');
			
		},
        removeDestination: function(evt: any): void{
			// remove a destination
			// calls a method of the Vue root instance
			let remove = confirm("Are you sure you want to remove this destination?");
			if (remove) {
				let name = evt.target.id.split("_")[0]; // i.e. name_dest, and we want name
				this.$root.removeDestination(name);
			}
		},
        saveChanges: function(): void {
			// note: when save is clicked and the data is sent to the root
			// to update state, the destination name, if edited, will be
			// checked to make sure its new desired name is not already taken
			// by another destination

			let name = (this as any).destination.name;
			let destTitle = document.getElementById(name);
			let newName = destTitle?.textContent?.trim().split(' ')[0];

            // if new name is valid, the change will happen
            // if it doesn't happen, we'll at least have restored the dest title to its original
			if (destTitle) {
				destTitle.textContent = (this as any).currDestTitle;
                destTitle.setAttribute('contenteditable', "false");
			}

			// TODO: but what about cancelling unwanted edits!?
			let notes = document.getElementById(name + '_notes');
			notes?.setAttribute('disabled', 'true');

			let data : Destination = JSON.parse(JSON.stringify((this as any).destination));
            data.notes = (notes as HTMLTextAreaElement)?.value;
			data.newName = newName;
			
			// update data source with new info
			this.$root.updateDestination(data);
			
			(this as any).isEditing = false;
		},
        cancelChanges: function(): void {
			// TODO
		},
        uploadImage: function(evt: any): void {
            let img = new Image();
            let reader = new FileReader();
			let file = evt.target.files[0];

			reader.onloadend = () => {

                let imgSrcStr = reader.result as string;

				img.src = imgSrcStr;

				// update data
				let data: Destination = JSON.parse(JSON.stringify((this as any).destination)); // making a copy
                data.images.push(imgSrcStr);
				this.$root.updateDestination(data);
            };
            //read the file as a URL
            reader.readAsDataURL(file);
		},
        clickInput: function(): void {
			let inputElement = document.getElementById((this as any).destination.name + "_importImage");
            inputElement?.click();
		},
        enlargeImage: function(evt: any): void {
			let enlargedImage = new Image();
			enlargedImage.src = evt.target.src;

			let imageDiv = document.createElement('div');
			imageDiv.style.opacity = "0.98";
			imageDiv.style.backgroundColor = "#383838";
			imageDiv.style.position = "absolute";
			imageDiv.style.zIndex = "10";
			imageDiv.style.width = "100%";

			if (document.body.clientHeight < enlargedImage.height ||
				document.body.clientWidth < enlargedImage.width) {
				// reduce size of enlarged image if larger than the page
                enlargedImage.style.height = "50%";
                enlargedImage.style.width = "50%";
            }

			if (document.body.clientHeight > enlargedImage.height) {
				// if image height is smaller than the page height,
				// make sure the background is as tall as the page
				imageDiv.style.height = document.body.clientHeight + "px";
			}

			imageDiv.style.top = "0";
			imageDiv.style.left = "0";
			imageDiv.style.textAlign = "center";

			enlargedImage.style.margin = "0 auto";
            enlargedImage.addEventListener("dblclick", () => {
                imageDiv?.parentNode?.removeChild(imageDiv);
            });
            imageDiv.appendChild(enlargedImage);

            let cancel = document.createElement('h3');
            cancel.textContent = "close";
            cancel.style.color = "#fff";
			cancel.style.marginTop = "1%";
			cancel.style.fontFamily = "monospace";
            cancel.addEventListener("click", () => {
                imageDiv?.parentNode?.removeChild(imageDiv);
            });
            imageDiv.appendChild(cancel);

			document.body.appendChild(imageDiv);
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

    .delete {
        color: #8b0000;
        font-weight: bold;
        display: inline;
        font-size: 2em;
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

    img {
        height: 15%;
        width: 15%;
        border:  1px solid #000;
        display: inline-block;
    }

</style>