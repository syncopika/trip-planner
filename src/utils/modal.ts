import { Destination, OverpassAPIOptions, UserSelectedOptionsInModal } from './triproute';

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
                resolve("");
            };
        }).finally((): void => {
            // make sure to close modal
            document.body.removeChild(modal);
            document.body.removeChild(modalOverlay);
        });
    }

    // just a textbox with an ok button
    createMessageModal(text: string | string[], doNotCenterText?: boolean): Promise<boolean> {
        const modal = document.createElement('div');
        modal.id = "modal";
        Object.assign(modal.style, this.modalStyle);
        
        //const text = document.createElement('h2');
        if(typeof text === "string"){
            const displayText = document.createElement('p');
            displayText.textContent = text;
            
            if(doNotCenterText){
                displayText.style.textAlign = "left";
            }
        
            modal.appendChild(displayText);
        }else{
            text.forEach(t => {
                const displayText = document.createElement('p');
                displayText.textContent = t;
                
                if(doNotCenterText){
                    displayText.style.textAlign = "left";
                }
            
                modal.appendChild(displayText);
            });
        }
        
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
    
    _createDateInput(headerText: string): HTMLElement {
        const div = document.createElement('div');
        
        //const header = document.createElement('p');
        //header.textContent = `${headerText}:`;
        
        const monthInput = document.createElement('input');
        monthInput.id = `${headerText}monthInput`;
        monthInput.type = 'text';
        monthInput.size = 2;
        monthInput.maxLength = 2;
        monthInput.placeholder = 'mm';
        monthInput.style.display = 'inline-block';
        
        const dayInput = document.createElement('input');
        dayInput.id = `${headerText}dayInput`;
        dayInput.type = 'text';
        dayInput.size = 2;
        dayInput.maxLength = 2;
        dayInput.placeholder = 'dd';
        dayInput.style.display = 'inline-block';
        
        const yearInput = document.createElement('input');
        yearInput.id = `${headerText}yearInput`;
        yearInput.type = 'text';
        yearInput.size = 4;
        yearInput.maxLength = 4;
        yearInput.placeholder = 'yyyy';
        yearInput.style.display = 'inline-block';
        
        const slash1 = document.createElement('p');
        slash1.textContent = '/';
        slash1.style.display = 'inline-block';
        
        const slash2 = document.createElement('p');
        slash2.textContent = '/';
        slash2.style.display = 'inline-block';
        
        //div.appendChild(header);
        div.appendChild(monthInput);
        div.append(slash1);
        div.appendChild(dayInput);
        div.append(slash2);
        div.appendChild(yearInput);
        
        return div;
    }
    
    // modal for adding a new destination manually
    addNewDestinationModal(): Promise<Partial<Destination> | null> {
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
        destinationLat.type = "number";
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
        destinationLong.type = "number";
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
        
        // from date
        const fromDateInput = this._createDateInput('from');
        const from = document.createElement('p');
        from.textContent = 'from:';
        from.style.fontSize = '18px';
        from.style.margin = '0 auto';
        
        // to date
        const toDateInput = this._createDateInput('to');
        const to = document.createElement('p');
        to.textContent = 'to:';
        to.style.fontSize = '18px';
        to.style.margin = '0 auto';
        
        modal.appendChild(inputsDiv);
        modal.appendChild(document.createElement('br'));
        
        modal.appendChild(from);
        modal.appendChild(fromDateInput);
        modal.appendChild(to);
        modal.appendChild(toDateInput);
        
        const modalOverlay = document.createElement('div');
        modalOverlay.id = "modal-overlay";
        Object.assign(modalOverlay.style, this.modalOverlayStyle);
        
        document.body.appendChild(modal);
        document.body.appendChild(modalOverlay);
        
        const okBtn = document.createElement('button');
        okBtn.innerText = "ok";
        
        // button to allow user to try extracting lat/lng via Google Maps url instead
        const googleMapsExtractLatLngBtn = document.createElement('button');
        googleMapsExtractLatLngBtn.textContent = 'try extracting lat/lng from url';
        googleMapsExtractLatLngBtn.addEventListener('click', async () => {
            const res = await this.showLatLngExtractModal();
            if(res){
                destinationLat.value = `${res.latitude}`;
                destinationLong.value = `${res.longitude}`;
            }
        });
        modal.appendChild(googleMapsExtractLatLngBtn);
        
        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = "cancel";
        
        modal.appendChild(okBtn);
        modal.appendChild(cancelBtn);
        
        return new Promise<Partial<Destination> | null>((resolve) => {
            okBtn.onclick = (): void => {
                
                // TODO: come up with a better, not-so-hacky solution for getting the dates if set
                let fromDate = '';
                const fromMonth = document.getElementById('frommonthInput') as HTMLInputElement;
                const fromDay = document.getElementById('fromdayInput') as HTMLInputElement;
                const fromYear = document.getElementById('fromyearInput') as HTMLInputElement;
                
                if(fromMonth && fromDay && fromYear){
                    fromDate = `${fromMonth.value}-${fromDay.value}-${fromYear.value}`;
                }
                
                let toDate = '';
                const toMonth = document.getElementById('tomonthInput') as HTMLInputElement;
                const toDay = document.getElementById('todayInput') as HTMLInputElement;
                const toYear = document.getElementById('toyearInput') as HTMLInputElement;
                
                if(toMonth && toDay && toYear){
                    toDate = `${toMonth.value}-${toDay.value}-${toYear.value}`;
                }
              
                const data = {
                    name: destinationName.value,
                    latitude: parseFloat(destinationLat.value),
                    longitude: parseFloat(destinationLong.value),
                    notes: destinationNotes.value,
                    fromDate: fromDate,
                    toDate: toDate,
                };
                
                if(data.name === "" || isNaN(data.latitude) || isNaN(data.longitude)){
                    resolve({});
                }else{
                    resolve(data);
                }
            };
            cancelBtn.onclick = (): void => {
                resolve(null);
            };
        }).finally(() => {
            // make sure to close modal
            document.body.removeChild(modal);
            document.body.removeChild(modalOverlay);
        });
    }
    
    // modal for trying to extract latitude and longitude from a Google Maps url
    // regex: (-?[0-9]{1,2}.[0-9]+),(-?[0-9]{1,3}.[0-9]+)
    showLatLngExtractModal(): Promise<Record<string, number> | null> {
        const modal = document.createElement('div');
        modal.id = "modal";
        Object.assign(modal.style, this.modalStyle);
        
        const displayText = document.createElement('p');
        displayText.textContent = "Enter a Google Maps url and we'll try to extract the latitude and longitude so you don't have to manually type it in! :) ";
        modal.appendChild(displayText);
        
        // latitude
        const googleMapsUrlInput = document.createElement('input');
        googleMapsUrlInput.type = "text";
        googleMapsUrlInput.name = "googleMapsUrlInput";
        googleMapsUrlInput.value = "";
        googleMapsUrlInput.id = "googleMapsUrlInput";
        
        const googleMapsUrlInputLabel = document.createElement('label');
        googleMapsUrlInputLabel.textContent = "url: ";
        googleMapsUrlInputLabel.htmlFor = "googleMapsUrlInput";
        googleMapsUrlInputLabel.style.fontSize = "18px";
        
        modal.appendChild(googleMapsUrlInputLabel);
        modal.appendChild(googleMapsUrlInput);
        
        const modalOverlay = document.createElement('div');
        modalOverlay.id = "modal-overlay";
        Object.assign(modalOverlay.style, this.modalOverlayStyle);
        
        document.body.appendChild(modal);
        document.body.appendChild(modalOverlay);
        
        const extractBtn = document.createElement('button');
        extractBtn.innerText = "extract";
        
        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = "cancel";
        
        modal.appendChild(extractBtn);
        modal.appendChild(cancelBtn);
        
        return new Promise<Record<string, number> | null>((resolve) => {
            extractBtn.onclick = (): void => {
                const url = googleMapsUrlInput.value;
                const res = url.match(/-?([0-9]{1,2}.[0-9]+),(-?[0-9]{1,3}.[0-9]+)/g);
                if(res){
                    const loc = res[0].split(',');
                    if(loc.length == 2){
                        resolve({
                            latitude: parseFloat(loc[0]),
                            longitude: parseFloat(loc[1]),
                        });
                    }else{
                        resolve(null);
                    }
                }else{
                    resolve(null);
                }
            };
            cancelBtn.onclick = (): void => {
                resolve(null);
            };
        }).finally(() => {
            // make sure to close modal
            document.body.removeChild(modal);
            document.body.removeChild(modalOverlay);
        });
    }
}
