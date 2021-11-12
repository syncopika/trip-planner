interface Destination {
	name:       string;
	newName?:   string;
	toDate:     string;
	fromDate:   string;
	latitude:   number;
	longitude:  number;
	notes:      string;
	images:     string[];
	routeColor: string;
}

interface Trip {
    tripName: string;
    listOfDest: Destination[];
}

class TripRoute {

	name:		  string;
	destinations: Destination[];

	constructor(name: string) {
		this.name = name;
		this.destinations = [];
	}
	
	addDestination(dest: Destination): void {
		this.destinations.push(dest);
	}

	getDestinations(): Destination[] {
		return this.destinations;
	}
	
	getStop(stopNumber: number): Destination {
		if(stopNumber < 1){
			console.log("not a valid stop number. please pass in a number > 0.");
		}
		if(stopNumber > this.destinations.length){
			console.log("not a valid stop number: there are fewer stops than the number given.");
		}
		return this.destinations[stopNumber-1];
	}

}

export {
	TripRoute,
	Destination,
	Trip
}