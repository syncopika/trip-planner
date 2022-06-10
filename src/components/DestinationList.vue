<template>
    <div>
        <ul id="stops">
            <!-- each list element is a destination -->
            <destination 
                v-for="dest in listOfDest" 
                v-bind:key="dest.name+dest.latitude+dest.longitude"
                :destination="dest"
            >
            </destination>
        </ul>
    </div>
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Destination from './Destination.vue';

@Component({
    components: {
        Destination
    }
})

export default class DestinationList extends Vue {
    @Prop({ required: true }) public listOfDest!: Array<Record<string, any>>;
}
</script>