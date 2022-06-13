export interface Destination {
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

interface DestinationSuggestionMetadata {
    notes:      string;
    fromDate:   string;
    toDate:     string;
    images:     string[];
    routeColor: string;
}

export interface DestinationSuggestion {
    username:   string;
    destname:   string;
    tripname:   string;	
    latitude:   number;
    longitude:  number;
    index:      number;
    metadata:   DestinationSuggestionMetadata;
}

export interface Trip {
    tripName: string;
    listOfDest: Destination[];
}

export class TripRoute {

    name:          string;
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