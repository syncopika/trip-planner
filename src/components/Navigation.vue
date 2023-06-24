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
            <li class="selectOption" @click="openOptions"> options </li>
            
            <!-- TODO 
            
            <li> • </li>
            <li class="" @click="saveData"> save </li>

            <li> • </li>
            <li class=""> logout </li>
            
            -->
        </ul>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Modal } from "../utils/modal";
import { OverpassAPIOptions, UserSelectedOptionsInModal } from "../utils/triproute";

export default Vue.extend({
    props: {
        listOfTripNames: { required: true, type: Array }
    },
    data: function(){
        // default option values 
        // TODO: make a type for these
        return {
            mapType: "watercolor",
            theme: "pastel",
        }
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
        
        // update the map style
        changeMapStyle(mapStyleName: string): void {
            // send a custom event to the map iframe along with the mapStyleName
            const updateMapEvent = new CustomEvent('changeMapStyle', {detail: mapStyleName});
            const mapIframe = document.getElementById('mapContainer') as HTMLIFrameElement;

            if(mapIframe !== null && mapIframe.contentDocument !== null){
                mapIframe.contentDocument.dispatchEvent(updateMapEvent);
            }
        },
        
        // update the style theme
        // TODO: store theme data somewhere else?
        changeStyleTheme(themeName: string): void {
            if(themeName === "pastel"){
                document.documentElement.style.setProperty('--menu-header-bg-color', 'var(--pale-yellow)');
                document.documentElement.style.setProperty('--destination-bg-color', 'var(--yellow-green)');
                document.documentElement.style.setProperty('--column-1-bg-color', 'var(--pale-blue)');
                document.documentElement.style.setProperty('--column-2-bg-color', 'var(--pale-yellow)');
                document.documentElement.style.setProperty('--destination-list-bg-color', 'var(--pale-orange)');
            }else if(themeName === "gray"){
                document.documentElement.style.setProperty('--menu-header-bg-color', 'var(--light-gray)');
                document.documentElement.style.setProperty('--destination-bg-color', 'var(--white)');
                document.documentElement.style.setProperty('--column-1-bg-color', 'var(--light-gray)');
                document.documentElement.style.setProperty('--column-2-bg-color', 'var(--grayish-red)');
                document.documentElement.style.setProperty('--destination-list-bg-color', 'var(--light-grayish-orange)');
            }else if(themeName === "beach"){
                // https://colorhunt.co/palette/9ac5f499dbf5a7eceeffeebb
                document.documentElement.style.setProperty('--menu-header-bg-color', 'var(--soft-blue)');
                document.documentElement.style.setProperty('--destination-bg-color', 'var(--sky-blue)');
                document.documentElement.style.setProperty('--column-1-bg-color', 'var(--sky-blue)');
                document.documentElement.style.setProperty('--column-2-bg-color', 'var(--pale-turquoise)');
                document.documentElement.style.setProperty('--destination-list-bg-color', 'var(--oasis)');
            }
        },
        
        openOptions: async function(): Promise<void> {
            const modal = new Modal();
            
            // TODO: don't use any + create type for otherOptions
            const overpassOptions: OverpassAPIOptions = (this.$root as any).getCurrentOverpassAPIOptions();
            const otherOptions: Record<string, string> = {mapType: this.mapType, theme: this.theme};
            
            const data: UserSelectedOptionsInModal | Record<string, never> = await modal.createOptionsModal(overpassOptions, otherOptions);
            
            // execute some changes based on selected options
            if(data["mapType"]){
                this.changeMapStyle(data["mapType"]);
                this.mapType = data["mapType"];
            }
            if(data["theme"]){
                this.changeStyleTheme(data["theme"]);
                this.theme = data["theme"];
            }
            
            this.$emit('update-options', data);
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