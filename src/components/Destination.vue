<template>
    <!-- one li is one destination -->
    <li :id="destination.name + '_dest'"
        class="dest"
        draggable="true"
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
            <div v-if="isEditing" style="text-align: left" :id="destination.name + '_editRouteColor'" class="editRouteColor">
                <label :for="destination.name + '_routeColor'"> route color: </label>
                <input 
                    :id="destination.name + '_routeColor'" 
                    :name="destination.name + '_routeColor'"
                    :style="'color: #000;' + 'background-color: ' + destination.routeColor"
                    :value="destination.routeColor"
                    type="text"
                    size="7"
                    disabled
                />
                <input 
                  style="display: inline-block" 
                  type="color" 
                  :id="destination.name + '_routeColorPicker'" 
                  :value="destination.routeColor" 
                />
            </div>
            <h3 v-if="!isEditing"> route color: 
                <span :style="'background-color: ' + destination.routeColor">{{destination.routeColor}}</span>
            </h3>

            <hr />

            <p v-if="!isEditing" class="latlng"> lat: {{destination.latitude}}, long: {{destination.longitude}} </p>

            <div v-if="isEditing">
                <label id="latInputLabel" for="latInput">
                    lat:
                    <input id="latInput" type="number" :value="destination.latitude" />
                </label>
                
                <label id="lngInputLabel" for="lngInput">
                    long:
                    <input id="lngInput" type="number" :value="destination.longitude" />
                </label>
            </div>

            <button @click="toggleEdit" v-if="!isEditing"> edit </button>

            <input class="inputFile" type="file" accept="image/*" :id="destination.name + '_importImage'" @change="uploadImage" />
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
import { defineComponent } from 'vue';
import Calendar from './Calendar.vue';
import { Destination } from '../utils/triproute';
import { Modal } from '../utils/modal';

// get info passed from parent component (i.e. Sidebar)
export default defineComponent({
    data(){
        return {
            expanded: false,
            isEditing: false,
            editSnapshot: {},
            currDestTitle: "",
        }
    },
    components: {
        Calendar
    },
    props: {
        destination: {required: true, type: Object}
    },
    methods: {
        toggleVisibility: function(): void {
            const name = this.destination.name;
            const parent = document.getElementById(name + '_dest');
            const content = document.getElementById(name + '_content');

            if(content !== null){
                if(this.expanded && !this.isEditing){
                    content.style.display = "none";
                    
                    if(parent){
                        parent.setAttribute('draggable', 'true');
                    }
                }else{
                    content.style.display = 'block';
                    
                    if(parent){
                        // don't allow component to be draggable if open/expanded
                        parent.setAttribute('draggable', 'false');
                    }
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
            destTitle?.setAttribute('contenteditable', 'true');

            // save the current title so we can restore it if it can't be changed
            this.currDestTitle = destTitle?.textContent || '';

            // make content editable
            const notes = document.getElementById(name + '_notes');
            if(notes !== null) notes.removeAttribute('disabled');
        },
        
        removeDestination: async function(evt: Event): Promise<void> {
            // remove a destination
            // calls a method of the Vue root instance
            const modal = new Modal();
            const remove = await modal.createQuestionModal('Are you sure you want to remove this destination?');
            if(remove){
                const name = (evt.target as HTMLElement).id.split('_')[0]; // i.e. name_dest, and we want name
                this.$root?.removeDestination(name);
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
            if(destTitle){
                destTitle.textContent = this.currDestTitle;
                destTitle.setAttribute('contenteditable', 'false');
            }

            const notes = document.getElementById(name + '_notes');
            notes?.setAttribute('disabled', 'true');

            const data: Destination = JSON.parse(JSON.stringify(this.destination)); // make a copy
            data.notes = (notes as HTMLTextAreaElement)?.value;
            data.newName = newName;

            // get from and to dates
            const fromDate = this.$refs[`${name}_fromDate`].getDateInfo();
            const toDate = this.$refs[`${name}_toDate`].getDateInfo();

            data.fromDate = `${fromDate.month}-${fromDate.day}-${fromDate.year}`;
            data.toDate = `${toDate.month}-${toDate.day}-${toDate.year}`;
            
            // get lng and lat
            const latInput = document.getElementById('latInput') as HTMLInputElement;
            const lngInput = document.getElementById('lngInput') as HTMLInputElement;
            if(latInput) data.latitude = parseFloat(latInput.value);
            if(lngInput) data.longitude = parseFloat(lngInput.value);

            // get route color and remove color wheel
            const routeColorInput = document.getElementById(`${this.destination.name}_routeColorPicker`) as HTMLInputElement;
            if(routeColorInput) data.routeColor = routeColorInput.value;

            // update data source with new info
            this.$root?.updateDestination(data);

            this.isEditing = false;
        },
        
        cancelChanges: function(): void {
            // make sure destination name goes back to being uneditable
            const name = this.destination.name;
            const destTitle = document.getElementById(name);
            destTitle?.setAttribute('contenteditable', 'false');
            
            const notes = document.getElementById(name + '_notes');
            notes?.setAttribute('disabled', 'true');

            const currData = JSON.parse(JSON.stringify(this.editSnapshot));
            for(const data in currData){
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
                
                this.$root?.updateDestination(data);
            };
            //read the file as a URL
            reader.readAsDataURL(file);
        },
        
        clickInput: function(): void {
            const inputElement = document.getElementById(`${this.destination.name}_importImage`);
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
                document.body.clientWidth < enlargedImage.width){
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
        color: var(--black);
    }
    
    h3 {
        text-align: left;
    }
    
    h1 {
        display: inline;
    }

    button {
        font-family: inherit;
        background-color: var(--btn-bg-color);
        border: 1px solid var(--btn-border-color);
        color: var(--btn-text-color);
        display: inline;
        margin-left: 2px;
        margin-right: 2px;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        color: var(--destination-text-color);
        background-color: var(--destination-bg-color);
    }

    label {
        font-weight: bold;
    }

    img {
        height: 15%;
        width: 15%;
        border:  1px solid var(--black);
    }

    .dest {
        padding: 3px;
        border: 2px solid var(--black);
        text-align: center;
    }
    
    .dest:hover {
        border: 2px solid var(--white);
        cursor: pointer;
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
        color: var(--dark-red);
        font-weight: bold;
        display: inline;
        font-size: 2em;
    }

    .delete:hover {
        cursor: pointer;
        color: var(--bright-red);
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

    .editRouteColor {
      display: flex;
      align-items: center;
    }

    .editRouteColor input {
      background-color: transparent;
      border: none;
    }

    .editRouteColor input[type=color]:hover {
      cursor: pointer;
    }
    
    #latInputLabel, #lngInputLabel {
      display: block;
      padding: 0;
      margin-bottom: 8px;
    }

</style>