const express = require("express");
const router = express.Router();

router.get(`/api/status`, (request, response) => {
    response.status(200).json("Server Running!")
});

module.exports = router;