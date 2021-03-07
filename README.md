# trip-planner    
    
An experimental application to help plan out your future trips! or record old ones. One cool feature is that every time you add a new destination to your trip, you have the option of being recommended next destinations (which are places in close proximity to your last-added destination, based on destinations of other users).   
    
This project makes use of the MapBox API and so you need a token, which you can get for free (and comes with 50000 free API requests/month).    
    
My build is kinda weird right now in that I'm using an iframe to hold the MapBox map, which I'm storing in the public folder and building separately from the rest of the project (I still need to understand how vue-cli works 😅).       
    
some screenshots:    
![the main page](screenshots/screenshot.png)    
the main page    
    
![destination details](screenshots/screenshot2.png)    
destination details   
    
![marker tooltip](screenshots/screenshot4.png)    
marker tooltip info    
    
![trip dropdown menu](screenshots/screenshot3.png)    
choosing a different trip (can have multiple trips!)    
    
## Project setup
```
npm install
```
    
For setting up the iframe that contains the map, run `npm run setup-map-dev`. You'll have to add your MapBox API token to iframeSetup.ts first.    
    
### database/api server setup    
For the backend, I'm using postgres. For this project my test db is `trip_planner_test` and I have 2 tables called `users` and `destinations`. I currently don't have any login functionality so the `users` table is not important atm. `destinations` is where all users' destination information is supposed to go. See notes.txt for more info about those tables. 

After postgres is setup, see loadFakeData.js, adjust any postgres-specific variables like username/password/database name and run `node loadFakeData.js` to import the data from `test_destinations.json` into the database.    

Make sure to run the backend server via `node api-server.js`. The Vue app makes calls for data to this server, which in turn communicates with the database.     
    
### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
