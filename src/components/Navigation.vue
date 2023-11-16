<template>
    <div id='menuHeader'>
        <h2> trip-planner </h2>
        <ul>
            <li id="createNewTrip"
                class="selectOption"
                @click="addNewTrip"
            >
                new trip
            </li>

            <li> • </li>
            <li class='dropdown'>
                <p class='dropbtn'> select trip </p>
                <div class='dropContent'>
                    <a 
                        href="#"
                        :id="'tripIndex_' + index"
                        v-for="(tripName, index) in listOfTripNames"
                        v-bind:key="tripName + '_' + index"
                        @click="selectTrip"
                    >
                        {{tripName}}
                    </a>
                </div>
            </li>

            <li> • </li>
            <li class="selectOption" @click="triggerImport"> import </li>
            <input type='file' @change="importData" id='importTripData'>

            <li> • </li>
            <!-- <li class="selectOption" @click="exportData"> export </li> -->
            <li class='dropdown'>
                <p class='dropbtn'> export </p>
                <div class='dropContent'>
                    <a href="#" @click="exportData">
                        export JSON
                    </a>
                    <a href="#" @click="exportCurrTripHTML">
                        export HTML
                    </a>
                </div>
            </li>
            
            <li> • </li>
            <li class="selectOption" @click="showOptionsModal=true"> options </li>
            
            <OptionsModal v-if="showOptionsModal" @update-options="handleUpdateOptions" @close="showOptionsModal=false"></OptionsModal>
        </ul>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import OptionsModal from './OptionsModal.vue';
import { Modal } from "../utils/modal";
import { OverpassAPIOptions, UserSelectedOptionsInModal } from "../utils/triproute";

export default Vue.extend({
    props: {
        listOfTripNames: { required: true, type: Array }
    },
    components: {
        OptionsModal
    },
    data: function(){
        return {
            mapType: "", // only 1 map type currently
            theme: "pastel",
            showLocationLookup: false,
            showSuggestedDestinations: false,
            showOptionsModal: false,
        };
    },
    methods: {
        addNewTrip: async function(): Promise<void> {
            const modalHandler = new Modal();
            const newTripName = await modalHandler.createInputModal("please enter the name of the new trip:");
            
            if(newTripName){
                (this.$root as any).addNewTrip(newTripName);
            }
        },
        
        selectTrip: function(evt: MouseEvent): void {
            if(evt){
                const index = parseInt((evt.target as HTMLParagraphElement).id.split("_")[1]);
                (this.$root as any).selectTrip(index);
            }
        },
        
        triggerImport: function(): void {
            if(confirm("Do you want to save or export your current data first? Importing will overwrite your current trip data.")){
                const importButton = document.getElementById('importTripData');
                importButton?.click();
            }
        },
        
        importData: function(evt: MouseEvent): void {
            // call root to import data
            (this.$root as any).importData(evt);
        },
        
        exportData: function(): void {
            // call root to download trip data
            (this.$root as any).exportData();
        },
        
        exportCurrTripHTML: function(): void {
            (this.$root as any).exportCurrTripHTML();
        },
        
        saveData: function(): void {
            // TODO: save current trip data to database
        },
    
        // update any option value changes from the OptionsModal component
        handleUpdateOptions(value: UserSelectedOptionsInModal): void {
            if(value.showSuggestedDestinations && value.nextDestDataSource === "overpassApi"){
                //@ts-ignore TODO: can we fix this without ignoring? (TS-2339)
                this.$root.setOverpassApiUse(true, value.overpassApiEntity); // update useOverpassAPI in root
            }else{
                //@ts-ignore TODO: can we fix this without ignoring? (TS-2339)
                this.$root.setOverpassApiUse(false);
            }
            
            //@ts-ignore TODO: can we fix this without ignoring? (TS-2339)
            this.$root.updateAppearancePerOptions(value);
        }
    }
});
</script>

<style scoped>
#menuHeader {
    background-color: var(--menu-header-bg-color);
    padding: 2px;
    padding-right: 5px;
    text-align: right;
}

#menuHeader h2{
    text-align: left;
}

#menuHeader p {
    display: inline;
}

#menuHeader p:hover {
    cursor: pointer;
}

#importTripData {
    display: none;
}

.selectOption:hover {
    color: var(--select-option-hover-color);
    cursor: pointer;
}

.dropbtn:hover {
    cursor: pointer;
    color: var(--grayish-blue);
}

.dropContent {
    display: none;
    position: absolute;
    z-index: 1;
    white-space: nowrap;
}

.dropContent a {
    padding: 2px 5px;
    text-decoration: none;
    display: block;
    border-bottom: 1px solid var(--black);
    font-size: 1.2em;
    background-color: var(--drop-content-anchor-bg-color);
    color: var(--drop-content-anchor-text-color);
    text-align: center;
}

.dropContent a:hover { 
    background-color: var(--drop-content-anchor-hover-color);
}

.dropdown:hover .dropContent { 
    display: block;
    cursor: pointer;
}

ul {
    display: table;
    width: 100%;
}

ul li {
    display: table-cell;
    text-align: center;
}
</style>