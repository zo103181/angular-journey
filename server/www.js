require("dotenv").config();

const express = require("express");
const session = require("express-session");

const app = express();
const path = require("path");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(express.static(__dirname + '../../../dist'));

const {
  apiFuelBrands,
  apiFuelLogs,
  apiFuelOctanes,
  apiFuelStations,
  apiHealth,
  apiVehicles,
  apiUsers
} = require("./api")

app.use(
  apiFuelBrands,
  apiFuelLogs,
  apiFuelOctanes,
  apiFuelStations,
  apiHealth,
  apiVehicles,
  apiUsers,
)

// Listen to the specified port, otherwise 3080
const PORT = process.env.PORT || 3080;
const server = app.listen(PORT, () => {
  console.info(`Server Running: http://localhost:${PORT}`);
});

/**
 * The SIGTERM signal is a generic signal used to cause program
 * termination. Unlike SIGKILL , this signal can be blocked,
 * handled, and ignored. It is the normal way to politely ask a
 * program to terminate. The shell command kill generates
 * SIGTERM by default.
 */
process.on("SIGTERM", () => {
  server.close(() => {
    console.info("Server Close: Process Terminated!");
  });
});