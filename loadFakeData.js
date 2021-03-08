const pg = require('pg');
const fs = require('fs');

// connect to db
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

// load in json
fs.readFile('test_destinations.json', 'utf8', (err, data) => {
	
	// read json and insert
	const jsonData = JSON.parse(data);

	// load in the data
	jsonData.forEach((record) => {
		const query = `
		INSERT INTO destinations (username, destname, tripname, index, latitude, longitude, metadata)
		VALUES($1, $2, $3, $4, $5, $6, $7)
		`;
		
		const values = [record.username, record.destname, record.tripname, record.index, record.latitude, record.longitude, JSON.stringify(record.metadata)];
		
		client.query(query, values, (err, res) => {
			if(err){
				console.log(err);
			}else{
				console.log('insert successful!');
			}
		});
	});
});