import { OverpassAPIOptions, UserSelectedOptionsInModal } from './triproute';

export class Modal {
    
    modalStyle: Record<string, string>;
    modalOverlayStyle: Record<string, string>;

    constructor(){
        this.modalStyle = {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: "1010",
            textAlign: "center",
            padding: "8px",
            backgroundColor: "#fff",
            width: "auto",
            height: "auto",
            boxShadow: "2px 2px 5px #ccc",
            border: "1px solid #ccc",
            overflowY: "auto",
        };
        
        this.modalOverlayStyle = {
            zIndex: "1000",
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "#aaa",
            opacity: "0.2",
        };
    }

    // modal for accepting text input
    createInputModal(text: string): Promise<string> {
        const modal = document.createElement('div');
        modal.id = "modal";
        Object.assign(modal.style, this.modalStyle); // add attributes from this.modalStyle to modal.style
        
        const displayText = document.createElement('p');
        displayText.textContent = text;
        displayText.style.marginBottom = "0px";
        
        const textInput = document.createElement('input');
        textInput.type = "text";
        
        modal.appendChild(displayText);
        modal.appendChild(document.createElement('br'));
        modal.appendChild(textInput);
        
        const submitBtn = document.createElement('button');
        submitBtn.innerText = "submit";
        
        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = "cancel";
        
        modal.appendChild(document.createElement('br'));
        modal.appendChild(document.createElement('br'));
        modal.appendChild(submitBtn);
        modal.appendChild(cancelBtn);
        
        const modalOverlay = document.createElement('div');
        modalOverlay.id = "modal-overlay";
        Object.assign(modalOverlay.style, this.modalOverlayStyle);
        
        document.body.appendChild(modal);
        document.body.appendChild(modalOverlay);
        
        return new Promise<string>((resolve, reject) => {
            submitBtn.onclick = (): void => {
                const inputText = textInput.value.trim();
                resolve(inputText);
            };
            
            cancelBtn.onclick = (): void => {
                resolve(undefined);
            };
        }).finally((): void => {
            // make sure to close modal
            document.body.removeChild(modal);
            document.body.removeChild(modalOverlay);
        });
    }

    // just a textbox with an ok button
    createMessageModal(text: string): Promise<boolean> {
        const modal = document.createElement('div');
        modal.id = "modal";
        Object.assign(modal.style, this.modalStyle);
        
        //const text = document.createElement('h2');
        const displayText = document.createElement('p');
        displayText.textContent = text;
        
        modal.appendChild(displayText);
        
        const okBtn = document.createElement('button');
        okBtn.innerText = "ok";
        modal.appendChild(okBtn);
        
        const modalOverlay = document.createElement('div');
        modalOverlay.id = "modal-overlay";
        Object.assign(modalOverlay.style, this.modalOverlayStyle);
        
        document.body.appendChild(modal);
        document.body.appendChild(modalOverlay);
        
        return new Promise<boolean>((resolve) => {
            okBtn.onclick = (): void => {
                resolve(true);
            };
        }).finally((): void => {
            // make sure to close modal
            document.body.removeChild(modal);
            document.body.removeChild(modalOverlay);
        });
    }
    
    // modal for asking a question. has an ok and cancel button.
    createQuestionModal(text: string): Promise<boolean> {
        const modal = document.createElement('div');
        modal.id = "modal";
        Object.assign(modal.style, this.modalStyle);
        
        const displayText = document.createElement('p');
        displayText.textContent = text;
        
        modal.appendChild(displayText);
        
        const okBtn = document.createElement('button');
        okBtn.innerText = "ok";
        
        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = "cancel";
        
        modal.appendChild(okBtn);
        modal.appendChild(cancelBtn);
        
        const modalOverlay = document.createElement('div');
        modalOverlay.id = "modal-overlay";
        Object.assign(modalOverlay.style, this.modalOverlayStyle);
        
        document.body.appendChild(modal);
        document.body.appendChild(modalOverlay);
        
        return new Promise<boolean>((resolve) => {
            okBtn.onclick = (): void => {
                resolve(true);
            };
            cancelBtn.onclick = (): void => {
                resolve(false);
            };
        }).finally((): void => {
            // make sure to close modal
            document.body.removeChild(modal);
            document.body.removeChild(modalOverlay);
        });
    }

    // TODO: just one options object? instead of a separate one for overpass options
    createOptionsModal(overpassOptions: OverpassAPIOptions, otherOptions: Record<string, string>): Promise<UserSelectedOptionsInModal | Record<string, never>> {
        const modal = document.createElement('div');
        modal.id = "modal";
        Object.assign(modal.style, this.modalStyle);
        modal.style.textAlign = ""; // no center alignment for options
        
        const experimentalNoteText = document.createElement('p');
        experimentalNoteText.textContent = "this feature is experimental. please don't expect too much :)";
        experimentalNoteText.style.fontWeight = "bold";
        experimentalNoteText.style.fontSize = "12px";
        
        // get current option values so we can set them
        const overpassApiEnabled = overpassOptions.useOverpassAPI;
        const selectedOverpassApiEntity = overpassOptions.selectedOverpassApiEntity;

        const displayText = document.createElement('h1');
        displayText.textContent = "options";
        
        modal.appendChild(displayText);
        modal.appendChild(document.createElement('hr'));
        
        // options related to location lookup via Overpass API within radius
        const locationLookupSectionText = document.createElement('p');
        locationLookupSectionText.textContent = "location lookup";
        locationLookupSectionText.style.fontSize = "18px";
        locationLookupSectionText.style.margin = "0";
        modal.appendChild(locationLookupSectionText);
        modal.appendChild(experimentalNoteText.cloneNode(true));
        
        const toggleLocationSearchBar = document.createElement('input');
        toggleLocationSearchBar.id = "toggleLocationSearch";
        toggleLocationSearchBar.name = "toggleLocationSearch";
        toggleLocationSearchBar.type = "checkbox";
        if(otherOptions.showLocationLookup) toggleLocationSearchBar.checked = otherOptions.showLocationLookup === "true";
        
        const toggleLocationSearchLabel = document.createElement('label');
        toggleLocationSearchLabel.htmlFor = toggleLocationSearchBar.id;
        toggleLocationSearchLabel.style.fontSize = "14px";
        toggleLocationSearchLabel.textContent = "show location search bar:";
        
        // TODO: add input to allow user to set radius of lookup
        
        modal.appendChild(toggleLocationSearchLabel);
        modal.appendChild(toggleLocationSearchBar);
        modal.appendChild(document.createElement('hr'));
        
        // options related to destination suggestions
        const destinationSuggestionSectionText = document.createElement('p');
        destinationSuggestionSectionText.textContent = "destination suggestions";
        destinationSuggestionSectionText.style.fontSize = "18px";
        destinationSuggestionSectionText.style.margin = "0";
        modal.appendChild(destinationSuggestionSectionText);
        modal.appendChild(experimentalNoteText.cloneNode(true));
        
        const destinationSuggestionSourceText = document.createElement('p');
        destinationSuggestionSourceText.textContent = "source:";
        destinationSuggestionSourceText.style.margin = "0";
        modal.appendChild(destinationSuggestionSourceText);
        
        // database option radio button
        const databaseOption = document.createElement('input');
        databaseOption.type = "radio";
        databaseOption.name = "destinationSuggestionSource";
        databaseOption.value = "database";
        databaseOption.id = "databaseOption";
        databaseOption.checked = !overpassApiEnabled;
        
        const databaseOptionLabel = document.createElement('label');
        databaseOptionLabel.textContent = "other users from database";
        databaseOptionLabel.htmlFor = "databaseOption";
        databaseOptionLabel.style.fontSize = "18px";
        
        modal.appendChild(databaseOption);
        modal.appendChild(databaseOptionLabel);
        modal.appendChild(document.createElement('br'));
        
        // overpass api radio button
        const overpassApiOption = document.createElement('input');
        overpassApiOption.type = "radio";
        overpassApiOption.name = "destinationSuggestionSource";
        overpassApiOption.value = "overpassApi";
        overpassApiOption.id = "overpassApiOption";
        overpassApiOption.checked = overpassApiEnabled;
        
        const overpassApiOptionLabel = document.createElement('label');
        overpassApiOptionLabel.textContent = "Overpass API";
        overpassApiOptionLabel.htmlFor = "overpassApiOption";
        overpassApiOptionLabel.style.fontSize = "16px";
        
        modal.appendChild(overpassApiOption);
        modal.appendChild(overpassApiOptionLabel);
        modal.appendChild(document.createElement('br'));
        
        // select for type of suggested destinations to show
        const overpassApiSelect = document.createElement('select');
        overpassApiSelect.id = "overpassApiSelect";
        overpassApiSelect.style.marginTop = "10px";
        overpassApiSelect.disabled = !overpassApiEnabled;

        const overpassEntities: string[] = overpassOptions.overpassEntities;
        overpassEntities.forEach(type => {
            const opt = document.createElement('option');
            opt.value = type;
            opt.textContent = type;
            
            if(type === selectedOverpassApiEntity){
                opt.selected = true;
            }
            
            overpassApiSelect.appendChild(opt);
        });
        
        const overpassApiSelectLabel = document.createElement('label');
        overpassApiSelectLabel.htmlFor = "overpassApiSelect";
        overpassApiSelectLabel.textContent = "suggested destination type: ";
        overpassApiSelectLabel.style.fontSize = "14px";
        
        overpassApiOption.addEventListener('change', (evt) => {
            overpassApiSelect.disabled = false;
        });
        
        databaseOption.addEventListener('change', (evt) => {
            overpassApiSelect.disabled = true;
        });
        
        modal.appendChild(overpassApiSelectLabel);
        modal.appendChild(overpassApiSelect);
        
        modal.appendChild(document.createElement('hr'));
        
        // options related to appearance of trip-planner
        const appearanceOptionsSectionText = document.createElement('p');
        appearanceOptionsSectionText.textContent = "appearance";
        appearanceOptionsSectionText.style.fontSize = "18px";
        appearanceOptionsSectionText.style.margin = "0 0 5px 0";
        modal.appendChild(appearanceOptionsSectionText);
        
        // select for type of map to display
        const mapTypeSelect = document.createElement('select');
        mapTypeSelect.id = "mapTypeSelect";

        const mapTypes = ["watercolor", "terrain", "toner"];
        mapTypes.forEach(type => {
            const opt = document.createElement('option');
            opt.value = type;
            opt.textContent = type;
            
            if(otherOptions.mapType && otherOptions.mapType === type){
                opt.setAttribute('selected', 'true');
            }
            
            mapTypeSelect.appendChild(opt);
        });
        mapTypeSelect.style.marginBottom = "6px";
        
        const mapTypeSelectLabel = document.createElement('label');
        mapTypeSelectLabel.htmlFor = "mapTypeSelect";
        mapTypeSelectLabel.textContent = "map type: ";
        mapTypeSelectLabel.style.fontSize = "14px";
        
        modal.appendChild(mapTypeSelectLabel);
        modal.appendChild(mapTypeSelect);
        
        modal.appendChild(document.createElement('br'));
        
        // select theme
        const themeSelect = document.createElement('select');
        themeSelect.id = "themeSelect";
        const themes = ["pastel", "gray", "beach"];
        themes.forEach(themeName => {
            const themeOption = document.createElement('option');
            themeOption.textContent = themeName;
            themeOption.value = themeName;
            
            if(otherOptions.theme && otherOptions.theme === themeName){
                themeOption.setAttribute('selected', 'true');
            }
            
            themeSelect.appendChild(themeOption);
        });
        
        const themeSelectLabel = document.createElement('label');
        themeSelectLabel.htmlFor = "themeSelect";
        themeSelectLabel.textContent = "theme: ";
        themeSelectLabel.style.fontSize = "14px";
        
        modal.appendChild(themeSelectLabel);
        modal.appendChild(themeSelect);
        
        modal.appendChild(document.createElement('hr'));
        
        // ok, cancel buttons
        const okBtn = document.createElement('button');
        okBtn.innerText = "ok";
        okBtn.style.margin = '6px 3px 6px 6px';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = "cancel";
        cancelBtn.style.margin = '6px 6px 6px 3px';

        modal.appendChild(okBtn);
        modal.appendChild(cancelBtn);
        
        const modalOverlay = document.createElement('div');
        modalOverlay.id = "modal-overlay";
        Object.assign(modalOverlay.style, this.modalOverlayStyle);
        
        document.body.appendChild(modal);
        document.body.appendChild(modalOverlay);
        
        return new Promise<UserSelectedOptionsInModal | Record<string, never>>((resolve) => {
            okBtn.onclick = (): void => {
                resolve({
                    dataSource: !overpassApiSelect.disabled ? "overpassApi" : "database",
                    overpassApiEntity: overpassApiSelect.value,
                    mapType: mapTypeSelect.value,
                    theme: themeSelect.value,
                    showLocationLookup: toggleLocationSearchBar.checked.toString(),
                });
            };
            cancelBtn.onclick = (): void => {
                // TODO: maybe just return an object with all the keys set to empty values?
                resolve({});
            };
        }).finally((): void => {
            document.body.removeChild(modal);
            document.body.removeChild(modalOverlay);
        });
    }
    
    // modal for adding a new destination manually
    // TODO: make a specific type instead of using Record<string, string>
    addNewDestinationModal(): Promise<Record<string, string>> {
        const modal = document.createElement('div');
        modal.id = "modal";
        Object.assign(modal.style, this.modalStyle);
        
        const displayText = document.createElement('h1');
        displayText.textContent = "destination details";
        modal.appendChild(displayText);
        
        const inputsDiv = document.createElement('div');
        inputsDiv.style.display = "grid";
        inputsDiv.style.gridTemplateColumns = "1fr 50%";
        inputsDiv.style.gridGap = "8px";
        
        // destination name
        const destinationName = document.createElement('input');
        destinationName.type = "text";
        destinationName.name = "destinationName";
        destinationName.value = "";
        destinationName.id = "destinationName";
        
        const destinationNameLabel = document.createElement('label');
        destinationNameLabel.textContent = "name: ";
        destinationNameLabel.htmlFor = "destinationName";
        destinationNameLabel.style.fontSize = "18px";
        
        inputsDiv.appendChild(destinationNameLabel);
        inputsDiv.appendChild(destinationName);
        
        // latitude
        const destinationLat = document.createElement('input');
        destinationLat.type = "text";
        destinationLat.name = "destinationLat";
        destinationLat.value = "";
        destinationLat.id = "destinationLat";
        
        const destinationLatLabel = document.createElement('label');
        destinationLatLabel.textContent = "latitude: ";
        destinationLatLabel.htmlFor = "destinationLat";
        destinationLatLabel.style.fontSize = "18px";
        
        inputsDiv.appendChild(destinationLatLabel);
        inputsDiv.appendChild(destinationLat);
        
        // longitude
        const destinationLong = document.createElement('input');
        destinationLong.type = "text";
        destinationLong.name = "longitude: ";
        destinationLong.value = "";
        destinationLong.id = "destinationLong";
        
        const destinationLongLabel = document.createElement('label');
        destinationLongLabel.textContent = "longitude: ";
        destinationLongLabel.htmlFor = "destinationLong";
        destinationLongLabel.style.fontSize = "18px";
        
        inputsDiv.appendChild(destinationLongLabel);
        inputsDiv.appendChild(destinationLong);
        
        const destinationNotes = document.createElement('textarea');
        destinationNotes.id = "destinationNotes";
        const destinationNotesLabel = document.createElement('label');
        destinationNotesLabel.textContent = "notes: ";
        destinationNotesLabel.htmlFor = "destinationNotes";
        destinationNotesLabel.style.fontSize = "18px";
        
        inputsDiv.appendChild(destinationNotesLabel);
        inputsDiv.appendChild(destinationNotes);
        
        modal.appendChild(inputsDiv);
        modal.appendChild(document.createElement('br'));
        
        const modalOverlay = document.createElement('div');
        modalOverlay.id = "modal-overlay";
        Object.assign(modalOverlay.style, this.modalOverlayStyle);
        
        document.body.appendChild(modal);
        document.body.appendChild(modalOverlay);
        
        const okBtn = document.createElement('button');
        okBtn.innerText = "ok";
        
        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = "cancel";
        
        modal.appendChild(okBtn);
        modal.appendChild(cancelBtn);
        
        return new Promise<Record<string, string>>((resolve) => {
            okBtn.onclick = (): void => {
                const data = {
                    name: destinationName.value,
                    latitude: destinationLat.value,
                    longitude: destinationLong.value,
                    notes: destinationNotes.value,
                };
                
                if(data.name === "" || data.latitude === "" || data.longitude === ""){
                    resolve({});
                }else{
                    resolve(data);
                }
            };
            cancelBtn.onclick = (): void => {
                resolve({});
            };
        }).finally((): void => {
            // make sure to close modal
            document.body.removeChild(modal);
            document.body.removeChild(modalOverlay);
        });
    }
    
}
