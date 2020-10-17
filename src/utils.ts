// note: obsolete, no longer needed.


// some utility functions for creating new elements
// follow this: https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Vue_rendering_lists


import { Location } from './triproute';

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

// TODO: instead of info: Object, define an interface for info!
function addNewDestination(ulElementId: string, destName: string, info: Location): void {
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
	newDest.style.padding = "3px";
	newDest.style.border = "1px solid #000";
	newDest.style.borderRadius = "15px";
	newDest.style.textAlign = "center";
	newDest.setAttribute('expanded', 'false');
	
	let title = document.createElement('h1');
	title.textContent = destName;
	newDest.appendChild(title);
	
	// add notes 
	let infoSection = document.createElement('div');
	infoSection.style.display = "none";
	let notes = document.createElement('h2');
	notes.textContent = "notes: ";
	
	let notesSection = document.createElement('ul');
	notesSection.id = "destName" + "_notes";
	
	// add a button next to the destination name to be able to edit 
	// maybe this button should have multiple functionalities, i.e. be able to delete as well
	infoSection.appendChild(notes);
	infoSection.appendChild(notesSection);

	let location = document.createElement('p');
	location.textContent = "approx. latitude: " + info.lat + ", longitude: " + info.lng;
	
	infoSection.appendChild(location);
	
	let editButton = document.createElement('button');
	editButton.textContent = 'edit';
	editButton.addEventListener('click', (evt) => {
		evt.stopPropagation(); // don't make the parent section close 
		// allow editing of existing notes, addition of new notes and removal of notes
		
	});
	infoSection.appendChild(editButton);
	
	let addNoteButton = document.createElement('button');
	addNoteButton.style.display = 'inline';
	addNoteButton.style.marginLeft = '2px';
	addNoteButton.textContent = "add note";
	addNoteButton.addEventListener('click', (evt) => {
		evt.stopPropagation();
		let newNote = prompt('add new note');
		if(newNote){
			let note = document.createElement('li');
			note.style.fontSize = "22px";
			note.textContent = newNote
			notesSection.appendChild(note);
		}
	});
	infoSection.appendChild(addNoteButton);
	
	newDest.appendChild(infoSection);
	
	// make the element clickable to reveal the notes for this destination 
	newDest.addEventListener('mouseover', function(){
		this.style.border = '1px solid #fff';
	});
	
	newDest.addEventListener('mouseleave', function(){
		this.style.border = '';
		this.style.border = "1px solid #000";
	});
	
	newDest.addEventListener('click', function(){
		let isExpanded = this.getAttribute('expanded');
		if(isExpanded === "true"){
			// close
			this.setAttribute('expanded', 'false');
			infoSection.style.display = 'none';
		}else{
			// open
			this.setAttribute('expanded', 'true');
			infoSection.style.display = 'block';
		}
	});
	
	list.appendChild(newDest);
}

export {
	addNewDestination
}