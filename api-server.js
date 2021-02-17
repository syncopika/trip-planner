const pg = require('pg');

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

// TODO: set up app to host api endpoints to be called for interacting with the db