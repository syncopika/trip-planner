// this is the server that the frontend will communicate with to get back database info

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

const app = express();
app.use(bodyParser.json());

const corsOptions = {
	origin: "http://localhost:8080" // this is the acceptable origin for incoming requests
};

app.use(cors(corsOptions));

app.get("/api", (req, res) => {
	res.json({message: "hello there"});
});

app.post("/api/destinations", (req, res) => {
	// find closest destinations to a given lat and lng
	// formula: dist = arccos(sin(lat1) · sin(lat2) + cos(lat1) · cos(lat2) · cos(lon1 - lon2)) · R    //needs to be in radians!
	// from: http://janmatuschek.de/LatitudeLongitudeBoundingCoordinates
	const lat = (req.body.latitude * Math.PI) / 180; // need radians
	const long = (req.body.longitude * Math.PI) / 180;
	const radius = req.body.radius;
	const query = `SELECT * FROM destinations WHERE acos(sin(${lat}) * sin(radians(latitude)) + cos(${lat}) * cos(radians(latitude)) * cos(${long} - radians(longitude))) * 6371 <= ${radius}`;

	client.query(query, (err, dbRes) => {
		if(err){
			console.log(err);
		}else{
			res.json({destinations: dbRes.rows});
		}
	});
});

app.post("/api/userDestinations", (req, res) => {
	const body = req.body;
	const user = req.body.username;
	const query = `SELECT * FROM destinations WHERE username = '${user}'`;

	client.query(query, (err, dbRes) => {
		if(err) {
			console.log(err);
		} else {

			// need to rearrange some stuff
			/*
			this is what a destination object should look like for the frontend:
			{
                "name": "test",
                "latitude": 38.9486650738765,
                "longitude": -77.01459411621002,
                "notes": "hello world",
                "fromDate": "01-01-2020",
                "toDate": "01-05-2020",
                "images": [] as string[],
                "routeColor": "#888"
            }

			in the db a row looks like this:
			{
				"username": "user1",
				"destname": "test-1",
				"tripname": "my second trip",
				"latitude": 40.9486650738765,
				"longitude": -80.01459411621002,
				"index": 0,
				"metadata": {
					"notes": "hello world again",
					"fromDate": "01-01-2020",
					"toDate": "01-05-2020",
					"images": [],
					"routeColor": "#888"
				}
			}

			I think I designed this poorly ¯\_(ツ)_/¯
			*/
			const results = dbRes.rows;
			const response = {};
			
			for(const row of results) {
				row.metadata.name = row.destname;
				row.metadata.latitude = row.latitude;
				row.metadata.longitude = row.longitude;

				if(response[row.tripname] === undefined) {
					response[row.tripname] = [row.metadata];
				} else {
					response[row.tripname].push(row.metadata);
				}
			}

			const data = [];
			
			for(const trip in response) {
				const newTrip = {};
				newTrip.tripName = trip;
				newTrip.listOfDest = response[trip];
				data.push(newTrip);
			}

			res.json({ trips: data });
		}
	});
});

app.listen(8081, () => {
	console.log("server running on port 8081...");
});
