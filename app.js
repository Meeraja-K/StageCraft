const express = require("express");
const path = require('path');
const app = express();

var publicDir = path.join(__dirname, 'public');
app.use("/public/", express.static(publicDir));

var nodeModulesDir = path.join(__dirname, 'node_modules');
app.use('/node_modules/', express.static(nodeModulesDir)); 

// Handle GET requests to the root URL ('/') and respond by sending 'index.html' file to the client
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Start the server, listening on port 3000, and log a message when the server is running
app.listen(3000, function () {
  console.log("Server is running on localhost:3000");
});
