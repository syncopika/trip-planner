<template>
    <div>
        <ul 
            id="stops"
            @drop="onDrop" 
            @dragover.prevent
            @dragenter.prevent
        >
            <!-- each list element is a destination -->
            <destination 
                v-for="destObj in listOfDest" 
                v-bind:key="destObj.name + destObj.latitude + destObj.longitude"
                :destination="destObj"
            >
            </destination>
        </ul>
        <button style="margin-bottom: 5px;" @click="addDestinationManually"> add destination </button>
    </div>
</template>


<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Destination as DestinationInterface } from '../utils/triproute';
import { Modal } from "../utils/modal";
import Destination from './Destination.vue';

export default defineComponent({
    props: {
        listOfDest: {
            type: Array as PropType<Array<DestinationInterface>>,
            required: true
        }
    },
    components: {
        Destination
    },
    methods: {
        onDrop: function(evt: DragEvent): void {
            const thisEl = evt.target as HTMLElement;
            
            if(evt.dataTransfer){
                const currDragElementId = evt.dataTransfer.getData("currentDraggedElementId");
                
                // update order of destinations in the list
                if(thisEl && currDragElementId !== thisEl.id){
                    if(evt.dataTransfer){
                        const currDragName = currDragElementId.split("_")[0]; // extract the destination name from the id
                        const currDraggedElementIndex = this.listOfDest.findIndex(dest => dest.name === currDragName);
                        const targetName = thisEl.id.split("_")[0];
                        const targetElementIndex = this.listOfDest.findIndex(dest => dest.name === targetName);
                        this.listOfDest.splice(targetElementIndex, 0, this.listOfDest.splice(currDraggedElementIndex, 1)[0]);
                    }
                }
            }
        },
        
        addDestinationManually: async function(): Promise<void> {
            const data: DestinationInterface = {
                name:       "",
                toDate:     "",
                fromDate:   "",
                latitude:   0,
                longitude:  0,
                notes:      "",
                images:     [],
                routeColor: "#3FB1CE",
            };
            
            const modal = new Modal();
            const destinationData: Partial<DestinationInterface> | null = await modal.addNewDestinationModal();
            
            if(destinationData && destinationData.name && destinationData.latitude && destinationData.longitude){
                // make sure a destination with the same name cannot be added
                if(Array.from(this.listOfDest).some(x => x.name === destinationData.name)){
                    await modal.createMessageModal("A destination with the same name already exists. Please choose another name.");
                    return;
                }
            
                data.name = destinationData.name;
                data.latitude = destinationData.latitude;
                data.longitude = destinationData.longitude;
                data.notes = destinationData.notes || "";
                data.toDate = destinationData.toDate || "";
                data.fromDate = destinationData.fromDate || "";
                
                if(!isNaN(data.latitude) && !isNaN(data.longitude)){
                    console.log("adding new destination manually");
                    // update data source with new info
                    this.$root.addNewDestination(data);
                }
            }else if (destinationData){
                await modal.createMessageModal("Please provide a name, latitude and longitude.");
            }
        }
    }
})
</script>