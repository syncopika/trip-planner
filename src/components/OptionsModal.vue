<template>
    <div>
        <div class="modal">
            <h1> options </h1>
            <hr />
            <p id="locationLookup"> location lookup </p>
            <p class="experimentalNote"> experimental feaature. please don't expect too much :) </p>
            <label id="toggleLocationSearchBarLabel" for="toggleLocationSearchBar">show location search bar:</label>
            <input id="toggleLocationSearchBar" name="toggleLocationSearchBar" type="checkbox" />
            
            <hr />
            
            <p id="destinationSuggestions"> destination suggestions </p>
            <p class="experimentalNote"> experimental feaature. please don't expect too much :) </p>
            
            <label id="toggleSuggestedDestinationsLabel" for="toggleSuggestedDestinations">toggle suggested destinations:</label>
            <input id="toggleSuggestedDestinations" name="toggleSuggestedDestinations" type="checkbox" />
            
            <p id="destinationSuggestionSourceText"> source: </p>
            
            <input type="radio" name="destinationSuggestionSource" value="database" id="databaseOption"/>
            <label for="databaseOption">other users from database</label>
            
            <br />
            
            <input type="radio" name="destinationSuggestionSource" value="overpassApi" id="overpassApiOption"/>
            <label for="overpassApiOption">Overpass API</label>
            
            <br />
            
            <label for="overpassApiSelect">suggested destination type:</label>
            <select id="overpassApiSelect">
            </select>
            
            <hr />
            
            <p id="appearance">appearance</p>
            
            <select id="themeSelect">
                <option value="pastel"> pastel </option>
                <option value="gray"> gray </option>
                <option value="beach"> beach </option>
            </select>
            
            <label for="themeSelect"></label>
            
            <hr />
            
            <div id="buttons">
                <button @click="$emit('close')"> ok </button>
                <button @click="$emit('close')"> cancel </button>
            </div>
        </div>
        
        <div class="modalOverlay">
        </div>
    </div>
</template>

<script lang="ts">
// https://v2.vuejs.org/v2/examples/modal

import Vue from "vue";
import { Destination, OverpassAPIOptions, UserSelectedOptionsInModal } from '../utils/triproute';

export default Vue.extend({
    props: {
        /*
        overpassOptions: { required: true, type: OverpassAPIOptions }, 
        otherOptions: { required: true, type: Partial<UserSelectedOptionsInModal> },
        */
    },
    data: function(){
        // default option values
        return {
        }
    },
    methods: {
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
        text-align: center;
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
        backgroundColor: #aaa;
        opacity: "0.2";
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
</style>