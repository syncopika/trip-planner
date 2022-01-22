// note that we are using PostgreSQL here

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

async function resetDB(){
    await client.connect();
    
    // clear the tables
    await client.query(`truncate destinations`);
    console.log("destinations table is now empty");

    let data = await fs.readFileSync('test_destinations.json', 'utf8');
    const destData = JSON.parse(data);
    destData.forEach(async (record) => {
        const query = `
        INSERT INTO destinations (username, destname, tripname, index, latitude, longitude, metadata)
        VALUES($1, $2, $3, $4, $5, $6, $7)
        `;
        
        const values = [record.username, record.destname, record.tripname, record.index, record.latitude, record.longitude, JSON.stringify(record.metadata)];
        
        await client.query(query, values);
    });
    console.log('insert destinations successful!');
    
    await client.query(`truncate users`);
    console.log("users table is now empty");
    
    data = await fs.readFileSync('test_users.json', 'utf8');
    const userData = JSON.parse(data);
    userData.forEach(async (record) => {
        const query = `
        INSERT INTO users (username, password)
        VALUES($1, $2)
        `;
        
        const values = [record.username, record.password];
        
        await client.query(query, values);
    });
    
    console.log('insert users successful!');
    
    return new Promise((resolve, _) => resolve("done"));
}

resetDB().then((msg) => {
    console.log(msg);
    
    /*
    // why is this throwing an error even when called here?
    client.end(err => {
        console.log("disconnected");
        if(err){
            console.log(err.stack);
        }
    });
    */
});

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


