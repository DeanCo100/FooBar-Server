const { fileURLToPath } = require('url');
const path = require('path'); // Import the path module

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const net = require('net');


var app = express();

// Middleware setup
app.use(bodyParser.urlencoded({limit: '20mb',extended: true}));
app.use(bodyParser.json({ limit: '20mb' }));
app.use(express.json({ limit: '20mb' }));
app.use(cors());
app.use(express.static('public'));

// Connecting to the MongoDB server
process.env.NODE_ENV = 'local';
const customEnv = require('custom-env');
customEnv.env(process.env.NODE_ENV, './config');
console.log(process.env.CONNECTION_STRING);
console.log(process.env.PORT);
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Connect to the TCP server:
// Define the TCP server address and port
const serverAddress = process.env.TCP_IP_ADDRESS;
console.log('hop hop');
console.log(serverAddress)
const serverPort = process.env.TCP_PORT;
console.log('hop hop');
console.log(serverPort)
// Create a new TCP client
const client = net.createConnection({ host: serverAddress, port: serverPort }, () => {
  // Once connected, you can send messages to the server
  console.log('Connected to TCP server');

  // Example message: "ADD www.example.com"
  const message = 'ADD www.example.com';
  client.write(message); // Send message to the server
});

// Listen for data from the server
client.on('data', (data) => {
  console.log('Received data from server:', data.toString());
});

// Handle errors
client.on('error', (err) => {
  console.error('Error:', err);
});

// Handle disconnection
client.on('end', () => {
  console.log('Disconnected from server');
  client.end();
});




// Define and mount routes
const users = require('./routes/user');
const login = require('./routes/login');
const posts = require('./routes/post');
app.use('/api/users', users);
app.use('/api/tokens', login);
app.use('/api/posts', posts);


// Serve index.html for all routes
app.get('*', (req, res) => {
  // Remove the explicit declaration of __dirname
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Start the server on the specified port
app.listen(process.env.PORT);
