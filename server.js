///////////////////////////////////////////////
///////////// IMPORTS + VARIABLES /////////////
///////////////////////////////////////////////

//http is a protocol that allows for communication between a client and a server. It is the foundation of the web. The http module provides an API for creating HTTP servers and clients.
const http = require('http'); 
const CONSTANTS = require('./utils/constants.js');
const fs = require('fs');
const path = require('path');
// WebSockets are a protocol that allows for bidirectional communication. ws is a library that implements the WebSocket protocol. Instaniate a new WebSocket server by calling the WebSocket.Server constructor.
const WebSocket = require('ws');

// You may choose to use the constants defined in the file below
const { PORT, CLIENT } = CONSTANTS;

///////////////////////////////////////////////
///////////// HTTP SERVER LOGIC ///////////////
///////////////////////////////////////////////

// Create the HTTP server
const server = http.createServer((req, res) => {
  // get the file path from req.url, or '/public/index.html' if req.url is '/'
  const filePath = ( req.url === '/' ) ? '/public/index.html' : req.url;

  // determine the contentType by the file extension
  const extname = path.extname(filePath);
  let contentType = 'text/html';
  if (extname === '.js') contentType = 'text/javascript';
  else if (extname === '.css') contentType = 'text/css';

  // pipe the proper file to the res object
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(`${__dirname}/${filePath}`, 'utf8').pipe(res);
});

///////////////////////////////////////////////
////////////////// WS LOGIC ///////////////////
///////////////////////////////////////////////

// TODO
// Exercise 3: Create the WebSocket Server using the HTTP server
// calling WebSocket.Server instatiates a new WebSocket server!
// pass in the server as an argument. Key word: server. Value: server. es6 syntax.
const wsServer = new WebSocket.Server({ server });


// TODO
// Exercise 5: Respond to connection events 
// socket is the client connection.
  // Exercise 6: Respond to client messages
  // Exercise 7: Send a message back to the client, echoing the message received
  // Exercise 8: Broadcast messages received to all other clients
wsServer.on('connection', (socket)=>{
  console.log('A new client has connected to the server!')
})

///////////////////////////////////////////////
////////////// HELPER FUNCTIONS ///////////////
///////////////////////////////////////////////

function broadcast(data, socketToOmit) {
  // TODO
  // Exercise 8: Implement the broadcast pattern. Exclude the emitting socket!
}

// Start the server listening on localhost:8080
server.listen(PORT, () => {
  console.log(`Listening on: http://localhost:${server.address().port}`);
});

