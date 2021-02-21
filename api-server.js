const pg = require('pg');
const express = require('express');
const cors = require('cors');

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

const corsOptions = {
	origin: "http://localhost:8080" // this is the acceptable origin for incoming requests
};

app.use(cors(corsOptions));

app.get("/api", (req, res) => {
	res.json({message: "hello there"});
});

// probably should be POST
app.get("/api/destinations", (req, res) => {
	// do the db lookup
	// TODO: find closest destinations to a given lat and lng
	const query = `
	SELECT * FROM destinations
	`;
	client.query(query, (err, dbRes) => {
		if(err){
			console.log(err);
		}else{
			res.json({destinations: dbRes.rows});
		}
		//client.end();
	});
});

app.listen(8081, () => {
	console.log("server running on port 8081...");
});
