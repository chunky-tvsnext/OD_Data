const express = require('express');
const bodyParser = require('body-parser');
// var request = require('request');
var cors = require('cors');

// create express app
const app = express();
var port_number = process.env.PORT || 3000;

var whitelist = ['http://localhost:5300','http://localhost:3000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.prodUrl, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});
//new for cloud
// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://admin:admin0987@testdata-5fksd.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// }).then(() => {
//       console.log("Successfully connected to the database");    
//   }).catch(err => {
//       console.log('Could not connect to the database. Exiting now...', err);
//       process.exit();
//   });;
////////////////////////////

// define a simple route
app.get('/api/', (req, res) => {

    // request({
    //     uri: 'http://34.93.117.215:8443/battery/data/1990121A',
    //     qs: {
    //       api_key: '123456',
    //       query: 'World of Warcraft: Legion'
    //     }
    //   }).pipe(res);

      console.log(res);
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

// Require Notes routes
require('./app/routes/note.routes.js')(app);
require('./app/routes/log.routes.js')(app);

//WEB SOCKET============================================
//============================================
// const WebSocket = require('ws')

// const wss = new WebSocket.Server({ port: 9088 })

// wss.on('connection', ws => {
//   ws.on('message', message => {
//     console.log(`Received message => ${message}`)
//   })
//   ws.send('Server is connected!')
// })

//============================================
//WEB SOCKET============================================


// listen for requests
app.listen(port_number, () => {
    console.log(`Server is listening on port : ${port_number}`);
});