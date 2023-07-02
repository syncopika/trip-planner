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
        <button @click="addDestinationManually"> add destination manually </button>
    </div>
</template>


<script lang="ts">
import Vue, { PropType } from 'vue';
import Component from 'vue-class-component';
import { Destination as DestinationInterface } from '../utils/triproute';
import { Modal } from "../utils/modal";
import Destination from './Destination.vue';

const DestinationListProps = Vue.extend({
    props: {
        listOfDest: {
            type: Array as PropType<Array<DestinationInterface>>,
            required: true
        }
    }
})

@Component({
    components: {
        Destination
    }
})

export default class DestinationList extends DestinationListProps {
    
    onDrop(evt: DragEvent): void {
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
    }
    
    async addDestinationManually(): Promise<void> {
        const data: DestinationInterface = {
            name: "",
            toDate:     "",
            fromDate:   "",
            latitude:   0,
            longitude:  0,
            notes:      "",
            images:     [],
            routeColor: "#888",
        };
        
        const modal = new Modal();
        const destinationData: Record<string, string> = await modal.addNewDestinationModal();
        if(destinationData.name && destinationData.latitude && destinationData.longitude){
            data.name = destinationData.name;
            data.latitude = parseFloat(destinationData.latitude);
            data.longitude = parseFloat(destinationData.longitude);
            
            if(!isNaN(data.latitude) && !isNaN(data.longitude)){
                console.log("adding new destination manually");
                // update data source with new info
                //@ts-ignore 
                this.$root.addNewDestination(data);
            }
        }
    }
    
}
</script>