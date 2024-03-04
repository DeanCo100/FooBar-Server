const express = require('express');
var app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

const cors = require('cors');
app.use(cors());

const customEnv = require('custom-env');
customEnv.env(process.env.NODE_ENV, './config');
console.log(process.env.CONNECTION_STRING);
console.log(process.env.PORT);

const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.static('public'));

const users = require('./routes/user');
const login = require('./routes/login');

app.use('/api/users', users);
// app.use('/api/tokens', tokens);
app.use('/api/login', login);




app.listen(process.env.PORT);

// To run with the local/test we do "SET NODE_ENV=local/test"