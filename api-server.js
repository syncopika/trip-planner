const pg = require('pg');
const express = require('express');

// fill this info in with your local db info
const client = new pg.Client({
	user: 'postgres',
	host: 'localhost',
	database: 'trip_planner_test',
	password: 'password',
	port: 5432,
});

client.connect();

/*
const query = `
INSERT INTO users (username, password)
VALUES ('test_user', 'test')
`;

client.query(query, (err, res) => {
	if(err){
		console.log(err);
	}
	console.log('insert successful!');
	client.end();
});
*/

/*
const query = `
SELECT * FROM destinations
`;
client.query(query, (err, dbRes) => {
	if(err){
		console.log(err);
	}
	console.log(dbRes.rows);
	client.end();
});
*/

/*
const query = `
INSERT INTO destinations (username, destname, tripname, index, latitude, longitude, metadata)
VALUES ('test_user', 'test_dest', 'test_trip', 0, 25.0785476, 121.2326428, '{}')
`;
client.query(query, (err, res) => {
	if(err){
		console.log(err);
	}else{
		console.log('insert successful!');
	}
	client.end();
});
*/

// TODO: set up app to host api endpoints to be called for interacting with the db
const app = express();

app.get("/", (req, res) => {
	res.json({message: "hello there"});
});

// probably should be POST
app.get("/destinations", (req, res) => {
	// do the db lookup
	const query = `
	SELECT * FROM destinations
	`;
	client.query(query, (err, dbRes) => {
		if(err){
			console.log(err);
		}else{
			res.json({data: dbRes.rows});
		}
		client.end();
	});
});

app.listen(8081, () => {
	console.log("server running on port 8081...");
});
