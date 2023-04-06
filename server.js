///////////////////////////////////////////////
///////////// IMPORTS + VARIABLES /////////////
///////////////////////////////////////////////

//http is a protocol that allows for communication between a client and a server. It is the foundation of the web. The http module provides an API for creating HTTP servers and clients.
const http = require('http'); 
const CONSTANTS = require('./utils/constants.js');
const fs = require('fs');
const path = require('path');
// WebSockets are a protocol that allows for bidirectional communication. ws is a library that implements the WebSocket protocol. **Instaniate** a new WebSocket server by calling the WebSocket.Server constructor.
const WebSocket = require('ws');

// You may choose to use the constants defined in the file below
const { PORT, CLIENT, SERVER } = CONSTANTS;

///////////////////////////////////////////////
///////////// HTTP SERVER LOGIC ///////////////
///////////////////////////////////////////////

// Create the HTTP server
const server = http.createServer((req, res) => {
  // get the file path from req.url, or '/public/index.html' if req.url is '/'
  const filePath = ( req.url === '/' ) ? '/public/index.html' : req.url;

  // determine the contentType by the file extension
  const extname = path.extname(filePath);
  // contentType is a variable that holds the value of the content type of the file.
  let contentType = 'text/html';
  if (extname === '.js') {
    contentType = 'text/javascript';
  }
  else if (extname === '.css') {
    contentType = 'text/css';
  }

  // pipe the proper file to the res object
  res.writeHead(200, { 'Content-Type': contentType });
  // __dirname is a global variable that returns the path to the directory containing the currently executing file.
  // fs.createReadStream is a method that creates a readable stream. It takes in a path and an encoding.
  // pipe is a method that takes in a writable stream and pipes the readable stream to the writable stream.
  // res is a writable stream. It is a stream that writes to the client.
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
  // .on is a method that takes in an event and a callback function. The callback function is invoked when the event is emitted.
  // socket is the client connection. socket is an object representing the connection to the invididual/specific client.
  // socket.on is a method that takes in an event and a callback function. The callback function is invoked when the event is emitted.
  // socket.close is a method that closes the connection to the client.
wsServer.on('connection', (socket)=>{
  console.log('A new client has connected to the server!')
  // socket.on is a method that takes in an event and a callback function. The callback function is invoked when the event is emitted.
  // socket.close is a method that closes the connection to the client.
  // event handler for the 'message' event. The callback function is invoked when the event is emitted.
  // before broadcast was used, the message was sent back to the client that sent the message. With socket.send, the message is sent back to the client that sent the message.
  socket.on('message', (data)=>{
    console.log(data);

    const { type, payload } = JSON.parse(data);

    //showMessageReceived(message);
    switch (type) {
      case CLIENT.MESSAGE.NEW_USER:
        const time = new Date().toLocaleString();
        payload.time = time;
        const dataWithTime = {
          type: SERVER.BROADCAST.NEW_USER_WITH_TIME,
          payload
        }
        // broadcast the message to all connected clients
        // Need to use JSON.stringify because the data is an object. The data needs to be a string when it is sent to the client using a websocket.
        broadcast(JSON.stringify(dataWithTime));
        // break is a built-in function that stops the execution of a function
        break;
      case CLIENT.MESSAGE.NEW_MESSAGE:
        // broadcast the message to all connected clients
        broadcast(data, socket);
        break;
      default:
        break;
    }


  })
})

///////////////////////////////////////////////
////////////// HELPER FUNCTIONS ///////////////
///////////////////////////////////////////////

function broadcast(data, socketToOmit) {
  // TODO
  // Exercise 8: Implement the broadcast pattern. Exclude the emitting socket!
  // iterate over all clients connected to wsServer
  wsServer.clients.forEach(connectedClient =>{
    //check if connection is open && is not the emitting socket.
    // socket.readyState is a property that returns the state of the connection. 1 is open, 2 is closing, 3 is closed.
    // socketToOmit is the client that sent the message. It is the client that we do not want to send the message back to.
    // connectedClient is the client that we are iterating over. We want to send the message to all clients except the client that sent the message.
    // WebSocket.OPEN is a constant that represents the state of the connection. 1 is open, 2 is closing, 3 is closed.
    if(connectedClient.readyState === WebSocket.OPEN && connectedClient !== socketToOmit) {
      // socket.send is a method that takes in a message and sends it to the client.
      connectedClient.send(data);
    }
  })
}

// Start the server listening on localhost:8080
server.listen(PORT, () => {
  console.log(`Listening on: http://localhost:${server.address().port}`);
});

