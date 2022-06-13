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
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Destination as DestinationInterface } from '../utils/triproute';
import Destination from './Destination.vue';

@Component({
    components: {
        Destination
    }
})

export default class DestinationList extends Vue {

    @Prop({ required: true }) public listOfDest!: Array<Record<string, DestinationInterface>>;
    
    func(){
        console.log("heyyy");
    }
    
    onDrop(evt: DragEvent): void {
        const thisEl = evt.target as HTMLElement;
        
        if(evt.dataTransfer){
            const currDragElementId = evt.dataTransfer.getData("currentDraggedElementId");
            
            
            // update order of destinations in the list
            /*
            if(thisEl && currDragElementId !== thisEl.id){
                // find the index of the currentDraggedElement
                // get the index of this target element
                // splice currentDraggedElement to after target's index
                if(evt.dataTransfer){
                    const currDragName = currDragElementId.split("_")[0]; // extract the destination name from the id
                    const currDraggedElementIndex = this.listOfDest.findIndex(dest => dest.name === currDragName);
                    const targetName = thisEl.id.split("_")[0];
                    const targetElementIndex = this.listOfDest.findIndex(dest => dest.name === targetName);
                    
                    console.log("curr drag idx: " + currDraggedElementIndex);
                    console.log("target element index: " + targetElementIndex);
                    this.listOfDest.splice(targetElementIndex, 1, this.listOfDest[currDraggedElementIndex]);
                }
            }*/
        }
    }
    
}
</script>