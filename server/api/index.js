const apiHealth = require("./health");
const apiFuelBrands = require("./postgres/fuel-brands");
const apiFuelLogs = require("./postgres/fuel-logs");
const apiFuelOctanes = require("./postgres/fuel-octanes");
const apiFuelStations = require("./postgres/fuel-stations");
const apiVehicles = require("./postgres/vehicles");
const apiUsers = require("./postgres/users");

module.exports = {
    apiFuelBrands,
    apiFuelLogs,
    apiFuelOctanes,
    apiFuelStations,
    apiHealth,
    apiVehicles,
    apiUsers
}