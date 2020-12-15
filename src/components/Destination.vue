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
					<h3> from: </h3>
					<Calendar
						:dest-name="destination.name + '_from_'"
						:date="destination.fromDate"
						:is-editing="isEditing"
						:ref="destination.name + '_fromDate'"
					></Calendar>
				</div>
				<div class="col">
					<h3> to: </h3>
					<Calendar
						:dest-name="destination.name + '_to_'"
						:date="destination.toDate"
						:is-editing="isEditing"
						:ref="destination.name + '_toDate'"
					></Calendar>
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
			<h3> images: </h3>
			<div :id="destination.name + '_images'">
				<img 
					v-for="(image, index) in destination.images"
					v-bind:key="destination.name + '_image_' + index"
					:src="image"
					@dblclick="enlargeImage($event)" />
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

			<button v-on:click="toggleEdit"> edit </button>

			<input class="inputFile" type="file" accept="image/*" :id="destination.name + '_importImage'" @change="uploadImage">
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
        toggleEdit: function(evt: any): void {
		
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
        removeDestination: function(evt: any): void {
			// remove a destination
			// calls a method of the Vue root instance
			let remove = confirm("Are you sure you want to remove this destination?");
			if (remove) {
				let name = evt.target.id.split("_")[0]; // i.e. name_dest, and we want name

				//@ts-ignore TODO: can we fix this without ignoring? (TS-2339)
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

			let notes = document.getElementById(name + '_notes');
			notes?.setAttribute('disabled', 'true');

			let data : Destination = JSON.parse(JSON.stringify((this as any).destination)); // make a copy
            data.notes = (notes as HTMLTextAreaElement)?.value;
			data.newName = newName;

			// get from and to dates
			//@ts-ignore (TS-2339)
			let fromDate = this.$refs[name + "_fromDate"].getDateInfo();
			//@ts-ignore (TS-2339)
			let toDate = this.$refs[name + "_toDate"].getDateInfo();

			data.fromDate = `${fromDate.month}-${fromDate.day}-${fromDate.year}`;
            data.toDate = `${toDate.month}-${toDate.day}-${toDate.year}`;

			// get route color and remove color wheel
			let routeColorInput = document.getElementById((this as any).destination.name + "_routeColor") as HTMLInputElement;
			if(routeColorInput) data.routeColor = routeColorInput.value;

            let colorWheel = document.getElementById((this as any).destination.name + "_colorWheel");
            if(colorWheel && colorWheel.parentNode) colorWheel.parentNode.removeChild(colorWheel);

			// update data source with new info
			//@ts-ignore 
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

				//@ts-ignore 
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
		},
		showColorWheel: function(): void {
            let location = document.getElementById((this as any).destination.name + '_editRouteColor');

			let size = "200";
            let colorWheel = document.createElement('canvas');
            colorWheel.id = (this as any).destination.name + "_colorWheel";
            colorWheel.setAttribute('width', size);
            colorWheel.setAttribute('height', size);

            let colorWheelContext = colorWheel.getContext('2d');
            let x = colorWheel.width / 2;
            let y = colorWheel.height / 2;
            let radius = 90;

            // why 5600??
            if(colorWheelContext) {
				for(let angle = 0;angle <= 5600;angle++) {
					let startAngle = (angle - 2) * Math.PI / 180; //convert angles to radians
					let endAngle = (angle) * Math.PI / 180;
					colorWheelContext.beginPath();
					colorWheelContext.moveTo(x, y);
					//.arc(x, y, radius, startAngle, endAngle, anticlockwise)
					colorWheelContext.arc(x, y, radius, startAngle, endAngle, false);
					colorWheelContext.closePath();
					//use .createRadialGradient to get a different color for each angle
					//createRadialGradient(x0, y0, r0, x1, y1, r1)
					let gradient = colorWheelContext.createRadialGradient(x, y, 0, startAngle, endAngle, radius);
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
					let x = e.offsetX;
					let y = e.offsetY;

					//@ts-ignore (2531)
					let colorPicked = (colorWheel.getContext('2d')).getImageData(x, y, 1, 1).data;
					// convert to hex?
					let colorCode = 'rgb(' + colorPicked[0] + ',' + colorPicked[1] + ',' + colorPicked[2] + ')';
                    let colorInput = document.getElementById((this as any).destination.name + "_routeColor") as HTMLInputElement;
					if(colorInput) {
						colorInput.value = colorCode;
						colorInput.style.backgroundColor = colorCode;
					}
				});
			}

			if(location) location.appendChild(colorWheel);
        }
	}
};
</script>

<style scoped>
	.dest {
		padding: 3px;
		border: 2px solid #000;
		border-radius: 15px;
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

    .delete {
        color: #8b0000;
        font-weight: bold;
        display: inline;
        font-size: 2em;
    }

    .inputFile {
        display: none;
    }
	
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
        margin: 0 10px 10px;
        color: #000;
        background-color: #D9E5AE;
    }

	label {
		font-weight: bold;
	}

    img {
        height: 15%;
        width: 15%;
        border:  1px solid #000;
        display: inline-block;
    }

</style>