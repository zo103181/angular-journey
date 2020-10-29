const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname + '../../../dist'));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '../../../dist/index.html'));
});

// Listen to the specified port, otherwise 3000
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server Running: http://localhost:${PORT}`);
});

/**
 * The SIGTERM signal is a generic signal used to cause program termination. 
 * Unlike SIGKILL , this signal can be blocked, handled, and ignored. 
 * It is the normal way to politely ask a program to terminate. 
 * The shell command kill generates SIGTERM by default.
 */
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server Close: Process Terminated!');
    });
});