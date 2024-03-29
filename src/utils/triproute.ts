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
    destname:   string;
    latitude:   number;
    longitude:  number;
}

export interface UserDestinationSuggestion extends DestinationSuggestion {
    username:   string;
    tripname:   string;
    index:      number;
    metadata:   DestinationSuggestionMetadata;
}

export interface OverpassAPIDestinationSuggestion extends DestinationSuggestion {
    website?:   string;
    address?:   string;
    type?:      string;
}

export interface OverpassAPINode {
    id:   number;
    lat:  number;
    lon:  number;
    tags: Record<string, string>;
    type: string;
}

export interface OverpassAPIData {
    generator: string;
    version:   number;
    osm3s:     Record<string, string>;
    elements:  OverpassAPINode[];
}

export interface OverpassAPIOptions {
    useOverpassAPI:            boolean;
    selectedOverpassApiEntity: string;
    overpassEntities:          string[]; // TODO: make a type for valid entities?
}

// selectable options from options modal
export interface UserSelectedOptionsInModal {
    nextDestDataSource:        string; // should be: 'overpassApi' | 'database' - what data source to get suggested next destinations from
    overpassApiEntity:         string; // the selected overpass api entity (e.g. museum, restaurant, hotel, etc.)
    mapType:                   string; // selected map type. currently only 1 type available.
    theme:                     string;
    showLocationLookup:        boolean;
    showSuggestedDestinations: boolean;
}

export interface Trip {
    tripName: string;
    listOfDest: Destination[];
}

export class TripRoute {
    name:         string;
    destinations: Destination[];

    constructor(name: string){
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