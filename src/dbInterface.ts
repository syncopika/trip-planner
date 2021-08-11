// interface for any specific db-interfacing class to implement
// e.g. we can have a class to use for a MongoDB instance and a different one for a Postgres instance
// but they'll all implement this interface

type databaseRow = {
	// todo: define the type matching whatever a row in the db should look like?
	// or define in some other file like definitions.ts and use here
}

interface dbInterface {
	// find the closest n destinations within a certain radius given lat and long
	getClosestDestinations(maxResults: number, latitude: number, longitude: number, radius: number): {destinations: any}; // destinations should be an array of trip data
	
	getUserDestinations(username: string): {trips: any}; // trips should be an array of trip data
}