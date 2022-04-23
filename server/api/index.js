const apiHealth = require("./health");
const apiVehicles = require("./postgres/vehicles");
const apiUsers = require("./postgres/users");

module.exports = {
    apiHealth,
    apiVehicles,
    apiUsers
}