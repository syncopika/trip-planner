
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
	        width: "20%",
	        height: "auto",
	        boxShadow: "2px 2px 5px #ccc",
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
	
}
