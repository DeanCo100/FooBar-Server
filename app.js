const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

var app = express();

// middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({ limit: '20mb' }));
app.use(express.json({ limit: '20mb' }));
app.use(cors());
app.use(express.static('public'));

// connecting to server
process.env.NODE_ENV ='local'
const customEnv = require('custom-env');
customEnv.env(process.env.NODE_ENV, './config');
console.log(process.env.CONNECTION_STRING);
console.log(process.env.PORT);
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const users = require('./routes/user');
const login = require('./routes/login');
app.use('/api/users', users);
app.use('/api/tokens', login);
app.listen(process.env.PORT);
// To run with the local/test we do "SET NODE_ENV=local/test"