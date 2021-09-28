// interface for interacting with Postgres
import { dbInterface } from "./dbInterface";

/*
const pg = require('pg');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// fill this info in with your local db info
const client = new pg.Client({
	user: 'postgres',
	host: 'localhost',
	database: 'trip_planner_test',
	password: 'password',
	port: 5432,
});

client.connect();
*/

export class PostgresInterface implements dbInterface {
	
	constructor(){
		// todo
	}
	
	getClosestDestinations(maxResults: number, latitude: number, longitude: number, radius: number): {destinations: any[]} {
		// todo
		return {destinations: []};
	}
	
	getUserDestinations(username: string): {trips: any[]} {
		// todo
		return {trips: []};
	}
	
}