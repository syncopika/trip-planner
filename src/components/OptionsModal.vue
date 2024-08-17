<template>
    <div>
        <div class="modal">
            <h1> options </h1>
            <p class="experimentalNote"> * = experimental feature. please don't expect too much :) </p>
            
            <hr />
            <p id="locationLookup"> location lookup* </p>
            <div class="section">
                <label 
                    id="toggleLocationSearchBarLabel" 
                    for="toggleLocationSearchBar"
                >
                    show location search bar:
                </label>
                <input 
                    id="toggleLocationSearchBar" 
                    name="toggleLocationSearchBar" 
                    type="checkbox" 
                    v-model="showLocationLookup" 
                    :checked="showLocationLookup"
                />
            </div>
            
            <hr />
           
            <p id="destinationSuggestions"> destination suggestions* </p>
            <div class="section">
                <label 
                    id="toggleSuggestedDestinationsLabel" 
                    for="toggleSuggestedDestinations"
                >
                    toggle suggested destinations:
                </label>
                <input 
                    id="toggleSuggestedDestinations" 
                    name="toggleSuggestedDestinations" 
                    type="checkbox" 
                    v-model="showSuggestedDestinations" 
                    :checked="showSuggestedDestinations"
                />
                
                
                <p id="destinationSuggestionSourceText"> data source: </p>
                <input 
                    type="radio" 
                    v-model="nextDestDataSource" 
                    name="destinationSuggestionSource" 
                    value="'database'" 
                    id="databaseOption"
                    :checked="nextDestDataSource == 'database'"
                    :disabled="!showSuggestedDestinations"
                />
                <label for="databaseOption">other users from database</label>
                
                <br />
                
                <input 
                    type="radio" 
                    v-model="nextDestDataSource" 
                    name="destinationSuggestionSource" 
                    value="'overpassApi'" 
                    id="overpassApiOption"
                    :checked="nextDestDataSource == 'overpassApi'"
                    :disabled="!showSuggestedDestinations"
                />
                <label for="overpassApiOption">Overpass API</label>
                
                <br />
                
                <label for="overpassApiSelect">suggested destination type:</label>
                <select 
                    id="overpassApiSelect" 
                    v-model="selectedOverpassApiEntity"
                    :disabled="!showSuggestedDestinations"
                >
                    <option 
                        v-for="entity in overpassApiEntities" 
                        :value="entity" 
                        :key="entity"
                    >{{entity}}</option>
                </select>
            </div>
            
            <hr />
            
            <p id="appearance">appearance</p>
            
            <div class="section">
                <label for="themeSelect">theme:</label>
                <select id="themeSelect" v-model="selectedTheme">
                    <option value="pastel" :selected="selectedTheme === 'pastel'"> pastel </option>
                    <option value="gray" :selected="selectedTheme === 'gray'"> gray </option>
                    <option value="beach" :selected="selectedTheme === 'beach'"> beach </option>
                </select>
            </div>
            
            <hr />
            
            <div id="buttons">
                <button @click="updateOptions"> ok </button>
                <button @click="$emit('close')"> cancel </button>
            </div>
        </div>
        
        <div class="modalOverlay">
        </div>
    </div>
</template>

<script lang="ts">
// https://v2.vuejs.org/v2/examples/modal

import { defineComponent } from "vue";
import { Destination, UserSelectedOptionsInModal } from '../utils/triproute';

export default defineComponent({
    props: {
        initialTheme: String,
        initialShowLocationLookup: Boolean,
        initialShowSuggestedDestinations: Boolean,
        initialOverpassApiEntity: String,
        initialNextDestDataSource: String,
    },
    data: function(){
        return {
            nextDestDataSource: this.initialNextDestDataSource,
            selectedOverpassApiEntity: this.initialOverpassApiEntity,
            mapType: '',
            selectedTheme: this.initialTheme,
            showLocationLookup: this.initialShowLocationLookup,
            showSuggestedDestinations: this.initialShowSuggestedDestinations,
            overpassApiEntities: [
                'restaurant',
                'arts_centre',
                'library',
                'aquarium',
                'attraction',
                'hotel',
                'museum',
            ],
        }
    },
    methods: {
        updateOptions: function(): void {
            const data: UserSelectedOptionsInModal = {
                theme: this.selectedTheme,
                showLocationLookup: this.showLocationLookup,
                showSuggestedDestinations: this.showSuggestedDestinations,
                nextDestDataSource: this.nextDestDataSource,
                overpassApiEntity: this.selectedOverpassApiEntity,
                mapType: '',
            };
            
            //console.log(`selected options: ${JSON.stringify(data)}`);
            
            this.$emit('update-options', data);
            
            this.$emit("close");
        }
    }
});
</script>

<style scoped>
    .modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1010;
        padding: 8px;
        background-color: #fff;
        box-shadow: 2px 2px 5px #ccc;
        border: 1px solid #ccc;
        overflow-y: auto;
    }
    
    .modalOverlay {
        z-index: 1000;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #aaa;
        opacity: 0.2;
    }
    
    .experimentalNote {
        font-weight: bold;
        font-size: 11px;
    }
    
    h1 {
        text-align: center;
    }
    
    #locationLookup, #destinationSuggestions, #appearance {
        font-size: 18px;
        margin: 0;
        font-weight: bold;
        text-align: center;
    }
    
    #destinationSuggestionSourceText {
        margin: 10px 0px 0px;
    }
    
    #buttons {
        text-align: center;
    }
    
    button {
        margin: '6px 6px 6px 3px';
    }
    
    label {
        font-size: 14px;
        padding: 0;
    }
    
    select {
        margin-left: 5px;
    }
    
    .section {
        text-align: left;
    }
    
</style>