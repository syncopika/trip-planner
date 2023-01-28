<template>
    <!-- one li is one destination -->
    <li :id="destination.name + '_dest'"
        class="dest"
        @mouseover="highlightBorder"
        @mouseleave="dehighlightBorder"
        draggable
        @dragstart="onDragStart"
        >

        <!-- name of destination -->
        <h1 :id="destination.name" @click="toggleVisibility"> 
            {{destination.name}} 
        </h1>
        <p 
            :id="destination.name + '_delete'"
            @click="removeDestination"
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

            <button @click="toggleEdit" v-if="!isEditing"> edit </button>

            <input class="inputFile" type="file" accept="image/*" :id="destination.name + '_importImage'" @change="uploadImage">
            <button v-if="isEditing" @click="clickInput"> upload image </button>

            <button class="editButton"
                    v-if="isEditing"
                    @click="saveChanges">
                save
            </button>

            <button class="editButton"
                    v-if="isEditing"
                    @click="cancelChanges">
                cancel
            </button>

        </div>
    </li>
</template>

<script lang="ts">
import Vue from 'vue';
import Calendar from './Calendar.vue';
import { Destination } from '../utils/triproute';
import { Modal } from '../utils/modal';

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
        
        toggleEdit: function(evt: Event): void {
            // prevent div from closing
            evt.stopPropagation();
            
            const name = this.destination.name;
            
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
        
        removeDestination: async function(evt: Event): Promise<void> {
            // remove a destination
            // calls a method of the Vue root instance
            const modal = new Modal();
            const remove = await modal.createQuestionModal("Are you sure you want to remove this destination?");
            if (remove) {
                const name = (evt.target as HTMLElement).id.split("_")[0]; // i.e. name_dest, and we want name

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
            const newName = destTitle?.textContent?.trim();

            // if new name is valid (i.e. not an empty string), the change will happen
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
            
            const notes = document.getElementById(name + '_notes');
            notes?.setAttribute('disabled', 'true');

            const currData = JSON.parse(JSON.stringify(this.editSnapshot));
            for(const data in currData) {
                this.destination[data] = currData[data];
            }
            this.editSnapshot = {};
            this.isEditing = false;
        },
        
        uploadImage: function(evt: Event): void {
            const img = new Image();
            const reader = new FileReader();
            const files = (evt.target as HTMLInputElement).files;
            
            if(files === null || files.length !== 1){
                return;
            }
            
            const file = files[0];

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
        
        enlargeImage: function(evt: Event): void {
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
            imageDiv.style.zIndex = "1010";

            document.body.style.overflow = "hidden";

            const enlargedImage = new Image();
            enlargedImage.src = (evt.target as HTMLImageElement).src;
            enlargedImage.addEventListener("dblclick", () => {
                imageDiv?.parentNode?.removeChild(imageDiv);
                document.body.style.overflow = "visible";
            });
            enlargedImage.style.marginTop = "1%";

            if(document.body.clientHeight < enlargedImage.height ||
                document.body.clientWidth < enlargedImage.width) {
                // reduce size of enlarged image if larger than the page
                // or rescale using a canvas?
            }

            imageDiv.appendChild(enlargedImage);

            const cancel = document.createElement('h3');
            cancel.textContent = "close";
            cancel.style.fontFamily = "Montserrat";
            cancel.style.fontWeight = "bold";
            cancel.style.fontSize = "2em";
            cancel.style.color = "#fff";
            cancel.style.marginTop = "1%";
            cancel.addEventListener("click", () => {
                imageDiv?.parentNode?.removeChild(imageDiv);
                document.body.style.overflow = "visible";
            });
            imageDiv.appendChild(cancel);

            document.body.appendChild(imageDiv);
        },
        
        deleteImage: function(evt: Event): void {
            // get index of image from id
            const imageIndexStr = (evt.target as HTMLElement).id.split("_");
            const imageIndex = parseInt(imageIndexStr[imageIndexStr.length - 1]);

            this.destination.images.splice(imageIndex, 1);
        },
        
        showColorWheel: function(): void {
            const location = document.getElementById(this.destination.name + '_editRouteColor');
            const colorWheelId = this.destination.name + "_colorWheel";
            
            if(document.getElementById(colorWheelId)){
                // don't add a new one if there already is one
                return;
            }
            
            const size = "200";
            const colorWheel = document.createElement('canvas');
            colorWheel.id = colorWheelId;
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
        },
        
        onDragStart: function(evt: DragEvent): void {
            evt.stopPropagation();
            
            const thisEl = evt.target as HTMLElement;
            if(thisEl){
                if(evt.dataTransfer){
                    evt.dataTransfer.dropEffect = "move";
                    evt.dataTransfer.effectAllowed = "move";
                    evt.dataTransfer.setData("currentDraggedElementId", thisEl.id);
                }
            }
        }
    }
});
</script>

<style scoped>
    textarea {
        font-family: inherit;
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
        font-family: inherit;
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