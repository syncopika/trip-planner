<template>
	<div id='menuHeader'>
		<h2> trip-planner </h2>
		<ul>
			<li id="createNewTrip"
				class="selectOption"
				v-on:click="addNewTrip"
			>
				new trip
			</li>

			<li> | </li>

			<li class='dropdown'>
				<p class='dropbtn'> select trip </p>
				<div class='dropContent'>
					<a 
						href="#"
						:id="'tripIndex_' + index"
						v-for="(tripName, index) in listOfTripNames"
						v-bind:key="tripName + '_' + index"
						@click="selectTrip"
					>
						{{tripName}}
					</a>
				</div>
			</li>

			<li> | </li>
			<li class="selectOption" @click="triggerImport"> import </li>
			<input type='file' @change="importData" id='importTripData'>

			<li> | </li>
			<li class="selectOption" @click="exportData"> export </li>

			<li> | </li>
			<li class="" @click="saveData"> save </li>

			<li> | </li>
			<li class=""> logout </li>
		</ul>
	</div>
</template>

<script lang="ts">
export default {
	props: {
		listOfTripNames: { required: true, type: Array }
	},
	methods: {
		// TODO: should we rather have the root Vue instance handle creating a modal? 
		// then we can just call a method from root and pass it params to customize as needed?
		showPrompt: async function(): Promise<string> {
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
			
			const text = document.createElement('h2');
			const text2 = document.createElement('p');
			
			text.textContent = "this is a test";
			text2.textContent = "please enter the name of the new trip:";
			
			const textInput = document.createElement('input');
			textInput.type = "text";
			
			modal.appendChild(text);
			modal.appendChild(text2);
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
					// get the input text and resolve it
					resolve("this is a test");
				};
				
				cancelBtn.onclick = () => {
					resolve(undefined);
				};
			}).finally(() => {
				// make sure to close modal
				document.body.removeChild(modal);
				document.body.removeChild(modalOverlay);
			});
		},
	
		addNewTrip: async function(): Promise<void> {
			const newTripName = await this.showPrompt();
			//console.log(newTripName);
			
			if(newTripName) {
				//@ts-ignore (TS-2339)
				this.$root.addNewTrip(newTripName);
			}
		},
		
		selectTrip: function(evt: MouseEvent): void {
			if(evt){
				const index = parseInt((evt.target as HTMLParagraphElement).id.split("_")[1]);
				// @ts-ignore (TS-2339)
				this.$root.selectTrip(index);
			}
		},
		
		triggerImport: function(): void {
			const importButton = document.getElementById('importTripData');
			importButton?.click();
		},
		
		importData: function(evt: MouseEvent): void {
			// call root to import data
			// @ts-ignore
			this.$root.importData(evt);
		},
		
		exportData: function(): void {
			// call root to download trip data
			// @ts-ignore
			this.$root.exportData();
		},
		
		saveData: function(): void {
			// TODO: save current trip data to database
		}
    }
}
</script>

<style scoped>
#menuHeader {
    background-color: #F9F4E1;
    padding: 2px;
    padding-right: 5px;
    text-align: right;
}

#menuHeader h2{
	text-align: left;
}

#menuHeader p {
	display: inline;
}

#importTripData {
	display: none;
}

.selectOption:hover {
	color: #aaabbb;
	cursor: pointer;
}

.dropbtn:hover {
	cursor: pointer;
	color: #aaabbb;
}

.dropContent {
    display: none;
    position: absolute;
    z-index: 1;
    white-space: nowrap;
}

.dropContent a {
	padding: 2px 5px;
	text-decoration: none;
	display: block;
	border-bottom: 1px solid #000;
	font-size: 1.5em;
	background-color: #fff;
	color: #000;
	text-align: center;
	border-radius: 12px;
}

.dropContent a:hover { background-color: #ddd}

.dropdown:hover .dropContent { 
	display: block;
	cursor: pointer;
}

ul {
	display: table;
	width: 100%;
}

ul li {
	display: table-cell;
	width: auto;
	text-align: left;
}
</style>