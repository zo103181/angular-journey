const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const path = require('path');

let user = [];
const rootUrl = '/api';

app.use(bodyParser.json());

// app.use(express.static(__dirname + '../../../dist'));

app.get(`${rootUrl}/user`, (req, res) => { res.json(user); });

app.post(`${rootUrl}/user`, (req, res) => {
  const reqUser = req.body.user;
  user = [];
  user.push(JSON.parse(reqUser));
  res.json(reqUser);
});

app.get(`${rootUrl}/status`, (req, res) => {
  res.json({info: 'Node.js, Express, and Postgres API'});
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Listen to the specified port, otherwise 3080
const PORT = process.env.PORT || 3080;
const server = app.listen(PORT, () => {
  console.log(`Server Running: http://localhost:${PORT}`);
});

/**
 * The SIGTERM signal is a generic signal used to cause program 
 * termination. Unlike SIGKILL , this signal can be blocked, 
 * handled, and ignored. It is the normal way to politely ask a 
 * program to terminate. The shell command kill generates 
 * SIGTERM by default.
 */
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server Close: Process Terminated!');
    });
});