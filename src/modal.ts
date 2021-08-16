
export class Modal {
	
	modalStyle: any;
	modalOverlayStyle: any;

	constructor(){
		this.modalStyle = {
			// TODO
		};
		
		this.modalOverlayStyle = {
			// TODO
		};
	}

	createInputModal(text: string): Promise<string> {
		const modal = document.createElement('div');
		modal.id = "modal";
		modal.style.position = "fixed";
		modal.style.top = "50%";
		modal.style.left = "50%";
		modal.style.transform = "translate(-50%, -50%)";
		modal.style.zIndex = "1010";
		modal.style.textAlign = "center";
		modal.style.padding = "5px";
		modal.style.backgroundColor = "#fff";
		modal.style.width = "25%";
		modal.style.height = "25%";
		modal.style.boxShadow = "2px 2px 5px #ccc";
		
		const displayText = document.createElement('p');
		displayText.textContent = text; //"please enter the name of the new trip:";
		
		const textInput = document.createElement('input');
		textInput.type = "text";
		
		modal.appendChild(displayText);
		modal.appendChild(textInput);
		
		const submitBtn = document.createElement('button');
		submitBtn.innerText = "submit";
		
		const cancelBtn = document.createElement('button');
		cancelBtn.innerText = "cancel";
		
		modal.appendChild(submitBtn);
		modal.appendChild(cancelBtn);
		
		const modalOverlay = document.createElement('div');
		modalOverlay.id = "modal-overlay";
		modalOverlay.style.zIndex = "1000";
		modalOverlay.style.position = "fixed";
		modalOverlay.style.top = "0";
		modalOverlay.style.left = "0";
		modalOverlay.style.width = "100%";
		modalOverlay.style.height = "100%";
		modalOverlay.style.backgroundColor = "#aaa";
		modalOverlay.style.opacity = "0.2";
		
		document.body.appendChild(modal);
		document.body.appendChild(modalOverlay);
		
		return new Promise<string>((resolve, reject) => {
			submitBtn.onclick = () => {
				const inputText = textInput.value.trim();
				resolve(inputText);
			};
			
			cancelBtn.onclick = () => {
				resolve(undefined);
			};
		}).finally(() => {
			// make sure to close modal
			document.body.removeChild(modal);
			document.body.removeChild(modalOverlay);
		});
	}

	createDialogModal(text: string): Promise<boolean> {
		const modal = document.createElement('div');
		modal.id = "modal";
		modal.style.position = "fixed";
		modal.style.top = "50%";
		modal.style.left = "50%";
		modal.style.transform = "translate(-50%, -50%)";
		modal.style.zIndex = "1010";
		modal.style.textAlign = "center";
		modal.style.padding = "5px";
		modal.style.backgroundColor = "#fff";
		modal.style.width = "25%";
		modal.style.height = "25%";
		modal.style.boxShadow = "2px 2px 5px #ccc";
		
		//const text = document.createElement('h2');
		const displayText = document.createElement('p');
		displayText.textContent = text;
		
		modal.appendChild(displayText);
		
		const okBtn = document.createElement('button');
		okBtn.innerText = "ok";
		
		const modalOverlay = document.createElement('div');
		modalOverlay.id = "modal-overlay";
		modalOverlay.style.zIndex = "1000";
		modalOverlay.style.position = "fixed";
		modalOverlay.style.top = "0";
		modalOverlay.style.left = "0";
		modalOverlay.style.width = "100%";
		modalOverlay.style.height = "100%";
		modalOverlay.style.backgroundColor = "#aaa";
		modalOverlay.style.opacity = "0.2";
		
		document.body.appendChild(modal);
		document.body.appendChild(modalOverlay);
		
		return new Promise<boolean>((resolve) => {
			okBtn.onclick = () => {
				resolve(true);
			};
			
		}).finally(() => {
			// make sure to close modal
			document.body.removeChild(modal);
			document.body.removeChild(modalOverlay);
		});
	}
	
}
