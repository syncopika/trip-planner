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
			<div :id="destination.name + '_dates'">
				<div class="row">
					<Calendar
						:dest-name="destination.name + '_from_'"
						:date="destination.fromDate"
						:is-editing="isEditing"
						:ref="destination.name + '_fromDate'"
						:header="'to'"
					></Calendar>
				</div>
				<div class="row">
					<Calendar
						:dest-name="destination.name + '_to_'"
						:date="destination.toDate"
						:is-editing="isEditing"
						:ref="destination.name + '_toDate'"
						:header="'from'"
					></Calendar>
				</div>
			</div>
			<!-- notes section -->
			<h3> notes: </h3>
			<div>
				<textarea 
					:value="destination.notes" 
					:id="destination.name + '_notes'" 
					rows="5"
					cols="50" 
					disabled
				>
				</textarea>
				<br />
			</div>

			<br />
			<h3> images: </h3>
			<div :id="destination.name + '_images'">
				<div v-for="(image, index) in destination.images" 
                     v-bind:key="'div_' + destination.name + '_image_' + index"
                     style="margin-right:2px"
                     class="imageContainer"
				>
					<img
						v-bind:key="destination.name + '_image_' + index"
						:src="image"
						@mouseover="function($event){$event.target.style.border='1px solid #e0ffff'}"
						@mouseout="function($event){$event.target.style.border='1px solid #000'}"
						@dblclick="enlargeImage($event)" 
					/>
					<h3
						:id="'delete_' + destination.name + '_image_' + index"
						v-if="isEditing"
						style="color:red"
						@click="deleteImage($event)"
					>
						x
					</h3>
				</div>
			</div>

			<br />
			<div v-if="isEditing" style="text-align: left" :id="destination.name + '_editRouteColor'">
				<label :for="destination.name + '_routeColor'"> route color: </label>
				<input 
					:id="destination.name + '_routeColor'" 
					:name="destination.name + '_routeColor'"
					:style="'background-color: ' + destination.routeColor"
					:value="destination.routeColor"
					type="text"
					size="7"
				/>
				<button style="display: inline-block" :id="destination.name + '_routeColor_btn'" @click="showColorWheel">
					show color wheel
				</button>
			</div>
			<h3 v-if="!isEditing"> route color: 
				<span :style="'background-color: ' + destination.routeColor">{{destination.routeColor}}</span>
			</h3>

			<hr />

			<p class='latlng'> lat: {{destination.latitude}}, long: {{destination.longitude}} </p>

			<button v-on:click="toggleEdit" v-if="!isEditing"> edit </button>

			<input class="inputFile" type="file" accept="image/*" :id="destination.name + '_importImage'" @change="uploadImage">
			<button v-if="isEditing" v-on:click="clickInput"> upload image </button>

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
import Vue from 'vue';
import { Destination } from '../triproute';
import Calendar from './Calendar.vue';

// get info passed from parent component (i.e. Sidebar)
export default Vue.extend({
	data(){
		return {
			expanded: false,
			isEditing: false,
			editSnapshot: {},
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
			const name = this.destination.name;
			const dest = document.getElementById(name + '_dest');
			if(dest !== null){
				dest.style.border = '2px solid #fff';
			}
		},
		
        dehighlightBorder: function(): void {
			const name = this.destination.name;
			const dest = document.getElementById(name + '_dest');
			if(dest !== null){
				dest.style.border = '2px solid #000';
			}	
		},
		
        toggleVisibility: function(): void {
			const name = this.destination.name;
			const content = document.getElementById(name + '_content');

			if(content !== null){
				if(this.expanded && !this.isEditing){
					content.style.display = "none";
				}else{
					content.style.display = "block";
				}
			}

			this.expanded = !this.expanded;
		},
		
        toggleEdit: function(evt: any): void {
			// prevent div from closing
			evt.stopPropagation();
			
			const name = this.destination.name;
		
			// set flag
			this.isEditing = true;

			// take a snapshot of all current data so we can cancel changes easily
			//console.log(this.destination);
			this.editSnapshot = JSON.parse(JSON.stringify(this.destination));
			
			// make destination name editable
			const destTitle = document.getElementById(name);
			destTitle?.setAttribute('contenteditable', "true");

			// save the current title so we can restore it if it can't be changed
			this.currDestTitle = destTitle?.textContent || "";

			// make content editable
			const notes = document.getElementById(name + '_notes');
			if(notes !== null) notes.removeAttribute('disabled');
		},
		
        removeDestination: function(evt: any): void {
			// remove a destination
			// calls a method of the Vue root instance
			const remove = confirm("Are you sure you want to remove this destination?");
			if (remove) {
				const name = evt.target.id.split("_")[0]; // i.e. name_dest, and we want name

				//@ts-ignore TODO: can we fix this without ignoring? (TS-2339)
				this.$root.removeDestination(name);
			}
		},
		
        saveChanges: function(): void {
			// note: when save is clicked and the data is sent to the root
			// to update state, the destination name, if edited, will be
			// checked to make sure its new desired name is not already taken
			// by another destination

			const name = this.destination.name;
			const destTitle = document.getElementById(name);
			const newName = destTitle?.textContent?.trim().split(' ')[0];

            // if new name is valid, the change will happen
            // if it doesn't happen, we'll at least have restored the dest title to its original
			if (destTitle) {
				destTitle.textContent = this.currDestTitle;
                destTitle.setAttribute('contenteditable', "false");
			}

			const notes = document.getElementById(name + '_notes');
			notes?.setAttribute('disabled', 'true');

			const data: Destination = JSON.parse(JSON.stringify(this.destination)); // make a copy
            data.notes = (notes as HTMLTextAreaElement)?.value;
			data.newName = newName;

			// get from and to dates
			//@ts-ignore (TS-2339)
			const fromDate = this.$refs[name + "_fromDate"].getDateInfo();
			//@ts-ignore (TS-2339)
			const toDate = this.$refs[name + "_toDate"].getDateInfo();

			data.fromDate = `${fromDate.month}-${fromDate.day}-${fromDate.year}`;
            data.toDate = `${toDate.month}-${toDate.day}-${toDate.year}`;

			// get route color and remove color wheel
			const routeColorInput = document.getElementById(this.destination.name + "_routeColor") as HTMLInputElement;
			if(routeColorInput) data.routeColor = routeColorInput.value;

            const colorWheel = document.getElementById(this.destination.name + "_colorWheel");
            if(colorWheel && colorWheel.parentNode) colorWheel.parentNode.removeChild(colorWheel);

			// update data source with new info
			//@ts-ignore 
			this.$root.updateDestination(data);

			this.isEditing = false;
		},
		
		cancelChanges: function(): void {
			// make sure destination name goes back to being uneditable
			const name = this.destination.name;
			const destTitle = document.getElementById(name);
			destTitle?.setAttribute('contenteditable', "false");

			const currData = JSON.parse(JSON.stringify(this.editSnapshot));
			for(const data in currData) {
				this.destination[data] = currData[data];
            }
			this.editSnapshot = {};
			this.isEditing = false;
		},
		
        uploadImage: function(evt: any): void {
            const img = new Image();
            const reader = new FileReader();
			const file = evt.target.files[0];

			reader.onloadend = (): void => {
                const imgSrcStr = reader.result as string;

				img.src = imgSrcStr;

				// update data
				const data: Destination = JSON.parse(JSON.stringify(this.destination)); // making a copy
				data.images.push(imgSrcStr);

				//@ts-ignore 
				this.$root.updateDestination(data);
            };
            //read the file as a URL
            reader.readAsDataURL(file);
		},
		
        clickInput: function(): void {
			const inputElement = document.getElementById(this.destination.name + "_importImage");
            inputElement?.click();
		},
		
		enlargeImage: function(evt: any): void {
            const imageDiv = document.createElement('div');
            imageDiv.style.opacity = "0.98";
            imageDiv.style.backgroundColor = "#383838";
            imageDiv.style.position = "fixed";
            imageDiv.style.top = "0";
			imageDiv.style.left = "0";
			imageDiv.style.height = "100%";
            imageDiv.style.width = "100%";
			imageDiv.style.textAlign = "center";
			imageDiv.style.overflow = "scroll";

			document.body.style.overflow = "hidden";

			const enlargedImage = new Image();
			enlargedImage.src = evt.target.src;
            enlargedImage.addEventListener("dblclick", () => {
				imageDiv?.parentNode?.removeChild(imageDiv);
                document.body.style.overflow = "visible";
            });

			if(document.body.clientHeight < enlargedImage.height ||
				document.body.clientWidth < enlargedImage.width) {
				// reduce size of enlarged image if larger than the page
                // or rescale using a canvas?
            }

            imageDiv.appendChild(enlargedImage);

            const cancel = document.createElement('h3');
			cancel.textContent = "close";
			cancel.style.fontWeight = "bold";
			cancel.style.fontSize = "2em";
            cancel.style.color = "#fff";
			cancel.style.marginTop = "1%";
			cancel.style.fontFamily = "monospace";
            cancel.addEventListener("click", () => {
				imageDiv?.parentNode?.removeChild(imageDiv);
                document.body.style.overflow = "visible";
            });
            imageDiv.appendChild(cancel);

			document.body.appendChild(imageDiv);
		},
		
		deleteImage: function(evt: any): void {
			// get index of image from id
			let imageIndex = evt.target.id.split("_");
			imageIndex = parseInt(imageIndex[imageIndex.length - 1]);

            this.destination.images.splice(imageIndex, 1);
        },
		
		showColorWheel: function(): void {
            const location = document.getElementById(this.destination.name + '_editRouteColor');

			const size = "200";
            const colorWheel = document.createElement('canvas');
            colorWheel.id = this.destination.name + "_colorWheel";
            colorWheel.setAttribute('width', size);
            colorWheel.setAttribute('height', size);

            const colorWheelContext = colorWheel.getContext('2d');
            const x = colorWheel.width / 2;
            const y = colorWheel.height / 2;
            const radius = 90;

            // why 5600??
            if(colorWheelContext) {
				for(let angle = 0;angle <= 5600;angle++) {
					const startAngle = (angle - 2) * Math.PI / 180; //convert angles to radians
					const endAngle = (angle) * Math.PI / 180;
					colorWheelContext.beginPath();
					colorWheelContext.moveTo(x, y);
					//.arc(x, y, radius, startAngle, endAngle, anticlockwise)
					colorWheelContext.arc(x, y, radius, startAngle, endAngle, false);
					colorWheelContext.closePath();
					//use .createRadialGradient to get a different color for each angle
					//createRadialGradient(x0, y0, r0, x1, y1, r1)
					const gradient = colorWheelContext.createRadialGradient(x, y, 0, startAngle, endAngle, radius);
					gradient.addColorStop(0, 'hsla(' + angle + ', 10%, 100%, 1)');
					gradient.addColorStop(1, 'hsla(' + angle + ', 100%, 50%, 1)');
					colorWheelContext.fillStyle = gradient;
					colorWheelContext.fill();
				}

				// make black a pickable color
				colorWheelContext.fillStyle = "#000";
				colorWheelContext.beginPath();
				colorWheelContext.arc(10, 10, 8, 0, 2 * Math.PI);
				colorWheelContext.fill();

				// make white pickable too
				// black outline
				colorWheelContext.beginPath();
				colorWheelContext.arc(30, 10, 8, 0, 2 * Math.PI); // border around the white 
				colorWheelContext.stroke();

				// make sure circle is filled with #fff
				colorWheelContext.fillStyle = "#fff";
				colorWheelContext.arc(30, 10, 8, 0, 2 * Math.PI);
				colorWheelContext.fill();

				colorWheel.addEventListener('click', (e) => {
					const x = e.offsetX;
					const y = e.offsetY;

					//@ts-ignore (2531)
					const colorPicked = (colorWheel.getContext('2d')).getImageData(x, y, 1, 1).data;
					// convert to hex?
					const colorCode = 'rgb(' + colorPicked[0] + ',' + colorPicked[1] + ',' + colorPicked[2] + ')';
                    const colorInput = document.getElementById(this.destination.name + "_routeColor") as HTMLInputElement;
					if(colorInput) {
						colorInput.value = colorCode;
						colorInput.style.backgroundColor = colorCode;
					}
				});
			}

			if(location) location.appendChild(colorWheel);
        }
	}
});
</script>

<style scoped>

	textarea {
		background-color: transparent;
		color: #000;
	}
	
	h3 {
		text-align: left;
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
        color: #000;
        background-color: #daf08b;
    }

	label {
		font-weight: bold;
	}

    img {
        height: 15%;
        width: 15%;
        border:  1px solid #000;
    }

    .dest {
        padding: 3px;
        border: 2px solid #000;
        /*border-radius: 15px;*/
        text-align: center;
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
	
	.date {
		display: inline-block;
	}

    .delete {
        color: #8b0000;
        font-weight: bold;
        display: inline;
        font-size: 2em;
    }

    .inputFile {
        display: none;
    }

    .imageContainer {
        display: inline;
        width: 100%;
        height: 100%;
    }

    .imageContainer h3 {
        text-align: center;
		margin-top: 0;
    }

</style>