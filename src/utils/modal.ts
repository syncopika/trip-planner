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
                resolve(undefined);
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
    
    // modal for adding a new destination manually
    addNewDestinationModal(): Promise<Partial<Destination>> {
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
        
        return new Promise<Partial<Destination>>((resolve) => {
            okBtn.onclick = (): void => {
                const data = {
                    name: destinationName.value,
                    latitude: parseFloat(destinationLat.value),
                    longitude: parseFloat(destinationLong.value),
                    notes: destinationNotes.value,
                };
                
                if(data.name === "" || isNaN(data.latitude) || isNaN(data.longitude)){
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
