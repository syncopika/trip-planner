<template>
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
</template>


<script lang="ts">
import Vue, { PropType } from 'vue';
import Component from 'vue-class-component';
import { Destination as DestinationInterface } from '../utils/triproute';
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
    
}
</script>