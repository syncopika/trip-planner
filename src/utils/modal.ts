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

    createOptionsModal(currOptions: OverpassAPIOptions): Promise<UserSelectedOptionsInModal | Record<string, never>> {
        const modal = document.createElement('div');
        modal.id = "modal";
        Object.assign(modal.style, this.modalStyle);
        
        // get current option values so we can set them
        const overpassApiEnabled = currOptions.useOverpassAPI;
        const selectedOverpassApiEntity = currOptions.selectedOverpassApiEntity;

        const displayText = document.createElement('h1');
        displayText.textContent = "options";
        
        modal.appendChild(displayText);
        modal.appendChild(document.createElement('hr'));
        
        const destinationSuggestionSourceText = document.createElement('p');
        destinationSuggestionSourceText.textContent = "choose source for destination suggestions:";
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
        overpassApiOptionLabel.style.fontSize = "18px";
        
        modal.appendChild(overpassApiOption);
        modal.appendChild(overpassApiOptionLabel);
        modal.appendChild(document.createElement('br'));
        
        // select for type of suggested destinations to show
        const overpassApiSelect = document.createElement('select');
        overpassApiSelect.id = "overpassApiSelect";
        overpassApiSelect.style.margin = '10px';
        overpassApiSelect.disabled = !overpassApiEnabled;

        const overpassEntities: string[] = currOptions.overpassEntities;
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
        
        // select for type of map to display
        const mapTypeSelect = document.createElement('select');
        mapTypeSelect.id = "mapTypeSelect";

        const mapTypes = ["watercolor", "terrain", "toner"];
        mapTypes.forEach(type => {
            const opt = document.createElement('option');
            opt.value = type;
            opt.textContent = type;
            mapTypeSelect.appendChild(opt);
        });
        mapTypeSelect.style.margin = "3px";
        
        const mapTypeSelectLabel = document.createElement('label');
        mapTypeSelectLabel.htmlFor = "mapTypeSelect";
        mapTypeSelectLabel.textContent = "map type: ";
        mapTypeSelectLabel.style.fontSize = "14px";
        
        modal.appendChild(mapTypeSelectLabel);
        modal.appendChild(mapTypeSelect);
        
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
                });
            };
            cancelBtn.onclick = (): void => {
                resolve({});
            };
        }).finally((): void => {
            document.body.removeChild(modal);
            document.body.removeChild(modalOverlay);
        });
    }
    
}
