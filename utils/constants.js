const PORT = 8080;
const CLIENT = {
  MESSAGE: {
    NEW_USER: 'NEW_USER',
    NEW_MESSAGE: 'NEW_MESSAGE'
  }
};

// ***This check allows the module to be used in the client and the server
// module is undefined in the client. module.exports is undefined in the server.
// This is a common pattern to check if the module is being used in the client or the server.
// module contains all the code that is being exported from the module.
// module.exports is the object that is being exported from the module.
// exports is a reference to module.exports.
if (typeof module !== "undefined" && module.exports) {
  module.exports = exports = {
    PORT,
    CLIENT
  }
}