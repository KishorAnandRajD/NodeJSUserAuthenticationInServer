// Main starting/entry point for the application
// To start the server in command prompt ..>node index.js
// If you have nodemon installed (check package.json script).. > npm run dev

// Import Statements
const express=require('express');  // Node uses 'require' instead of 'import'
const http=require('http');
const bodyParser=require('body-parser');
const morgan=require('morgan');
const app=express();
const router=require('./router'); // Custom function
const mongoose=require('mongoose'); // To connect mongoose to mongodb
const cors=require('cors');// To allow other domains or subdomains to access this server

//==============
// DB setup
//==============
mongoose.connect('mongodb://localhost:auth/auth');

//==============
// App setup
//==============
//morgan - logging framework (mostly used for debugging)
app.use(morgan('combined'));  // app.use registers 'morgan' as Middleware in express. Any incoming request to the server is passed into morgan

app.use(cors());// To allow other domains or subdomains to access this server. In our example its the client application for authentication from 3090 port

//bodyParser - parse incoming requests as json
app.use(bodyParser.json({type:'*/*'})); // app.use registers 'bodyParser' as Middleware in express.Any incoming request to the server is passed into bodyParser
router(app);



//==============
// Server setup
//==============
// IF there is an local environment variable with 'PORT' use that, else use 3090
const port=process.env.PORT || 3090;
const server=http.createServer(app); //http.createServer - native node library. app - express application instance
server.listen(port);
console.log('Server Listening on:',port);
