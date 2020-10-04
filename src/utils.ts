// some utility functions for creating new elements

function addNotesSectionToDest(destNode: HTMLElement): HTMLTextAreaElement {
	// add a notes section to a destination 
	//let dest = document.getElementById(destNodeId);
	
	let notes = document.createElement('textarea');
	notes.id = destNode.id + "_notes";
	notes.setAttribute('rows', '5');
	notes.setAttribute('cols', '35');
	notes.style.display = 'none';
	notes.readOnly = true;
	
	notes.addEventListener('click', (evt) => {
		evt.stopPropagation();
	});
	
	destNode.appendChild(notes);
	
	return notes;
}


function addNewDestination(ulElementId: string, destName: string): void {
	// supply an unordered list element id to add a new list element
	let list = document.getElementById(ulElementId);
	
	if(list === null){
		console.log("list does not exist");
		return;
	}
	
	// don't allow multiple destinations with the same name
	if(list.childNodes){
		for(let child of list.childNodes as any){
			if(child.id === destName){
				alert('You already have a destination with the name: ' + destName + '. Please choose a different name.');
				return;
			}
		}
	}
	
	let newDest = document.createElement('li');
	newDest.id = destName;
	newDest.textContent = destName;
	newDest.style.fontSize = "32px";
	newDest.style.padding = "3px";
	newDest.style.borderBottom = "1px solid #000";
	newDest.style.textAlign = "center";
	newDest.setAttribute('expanded', 'false');
	
	// add notes 
	let notes = addNotesSectionToDest(newDest);
	
	// add a button next to the destination name to be able to edit 
	// maybe this button should have multiple functionalities, i.e. be able to delete as well
	let editButton = document.createElement('button');
	editButton.textContent = 'edit';
	editButton.style.display = 'none';
	editButton.addEventListener('click', (evt) => {
		evt.stopPropagation(); // don't make the parent section close 
		notes.readOnly = false;
	});
	newDest.appendChild(editButton);
	
	// make the element clickable to reveal the notes for this destination 
	newDest.addEventListener('mouseover', function(){
		this.style.border = '1px solid #fff';
	});
	
	newDest.addEventListener('mouseleave', function(){
		this.style.border = '';
		this.style.borderBottom = "1px solid #000";
	});
	
	newDest.addEventListener('click', function(){
		let isExpanded = this.getAttribute('expanded');
		//console.log(isExpanded === "false");
		if(isExpanded === "true"){
			// close
			this.setAttribute('expanded', 'false');
			editButton.style.display = 'none';
			notes.style.display = 'none';
			notes.readOnly = true;
		}else{
			// open
			this.setAttribute('expanded', 'true');
			editButton.style.display = 'block';
			notes.style.display = 'block';
		}
	});
	
	list.appendChild(newDest);
}

export {
	addNewDestination
}