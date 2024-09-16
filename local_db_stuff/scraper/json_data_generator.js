// potentially helpful:
// https://stackoverflow.com/questions/6156501/read-a-file-one-line-at-a-time-in-node-js
// https://nodesource.com/blog/understanding-streams-in-nodejs/

const fs = require('fs');

function createRecordObject(record){
  if(record.length !== 5){
    return null;
  }
  
  return {
    'name': record[0],
    'country': record[1],
    'category': record[2],
    'latitude': record[3],
    'longitude': record[4],
  };
}

function addRecordToTable(record, table){
  const recordObj = createRecordObject(record);
  
  if(recordObj){
    const country = record[1];
    const category = record[2];
    
    if(country){
      if(table[country] === undefined){
        table[country] = {};
        table[country][category] = [recordObj];
      }else{
        if(table[country][category] === undefined){
          table[country][category] = [recordObj];
        }else{
          table[country][category].push(recordObj);
        }
      }
    }
  }
}

function generateJSON(table){
  const countries = Array.from(Object.keys(table));
  
  const json = [];
  
  const numUsers = 10;
  const destPerUser = 5;
  
  for(let i = 0; i < numUsers; i++){
    const username = `test_user${i}`;
    const country = countries[Math.floor(Math.random() * countries.length)];
    
    for(let j = 0; j < destPerUser; j++){
      const categories = Array.from(Object.keys(table[country]));
      const category = table[country][categories[Math.floor(Math.random() * categories.length)]];
      const destination = category[Math.floor(Math.random() * category.length)];
      
      json.push({
        username: username,
        destname: destination.name,
        tripname: `test_trip_${country}_user${i}`,	
        latitude: parseFloat(destination.latitude),
        longitude: parseFloat(destination.longitude),
        index: j,
        metadata: {
          'notes': '',
          'fromDate': '',
          'toDate': '',
          'images': [],
          'routeColor': '#888',
        }
      });
    }
  }
  
  fs.writeFile('new_test_data.json', JSON.stringify(json, null, 2), 'utf8', () => {});
}

fs.readFile('data.csv', 'utf8', (err, data) => {
  if(err){
    console.error(err);
    return;
  }
  
  const table = {};
  
  data = data.split('\n');
  
  data.forEach((r, idx) => {
    if(idx === 0) return;
    addRecordToTable(r.split(','), table);
  });
  
  //console.log(table);
  
  generateJSON(table);
  
  //console.log(data.substring(0, data.indexOf('\n')));
});