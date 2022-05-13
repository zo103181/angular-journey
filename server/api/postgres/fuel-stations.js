const express = require("express");
const router = express.Router();

const db = require("../../pg-pool");
const pool = db.getPool();

router.post(`/api/fuel/stations`, (req, res) => {
    if (!req.session.user) { return res.status(401).json() }

    let {
        brand_id,
        latitude,
        longitude,
        station_name,
        address,
        city,
        state,
        zip,
        is_confirmed,
        user_id
    } = req.body;

    if (!user_id ||
        !brand_id ||
        !latitude ||
        !longitude) { return res.status(400).json() }

    latitude = latitude.toString().trim();
    if (latitude.trim() === '') { return res.status(400).json() }

    longitude = longitude.toString().trim();
    if (longitude.trim() === '') { return res.status(400).json() }

    if (req.session.user.id != user_id) { return res.status(403).json() }

    ; (async () => {
        const client = await pool.connect();
        try {

            let query = {
                text: `INSERT INTO public.fuel_stations (
                            brand_id,
                            latitude,
                            longitude,
                            station_name,
                            address,
                            city,
                            state,
                            zip,
                            is_confirmed,
                            created_by
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
                        RETURNING station_id,
                                  brand_id,
                                  latitude,
                                  longitude,
                                  station_name,
                                  address,
                                  city,
                                  state,
                                  zip,
                                  is_confirmed`,
                values: [
                    brand_id,
                    latitude,
                    longitude,
                    station_name,
                    address,
                    city,
                    state,
                    zip,
                    is_confirmed,
                    user_id
                ]
            };

            let results = await client.query(query);
            if (results.rowCount > 0) {
                res.status(201).json(results.rows[0]);
            } else {
                res.status(404).json();
            }
        } finally {
            // Make sure to release the client before any error handling,
            // just in case the error handling itself throws an error.
            client.release();
        }
    })().catch(err => {
        console.log(err);
        res.status(500).json({ code: err.code, message: err.message });
    });
});

router.post(`/api/fuel/stations/search`, (req, res) => {
    if (!req.session.user) { return res.status(401).json() }

    let {
        latitude,
        longitude,
        radius,
        rows_per_page,
        page,
        user_id
    } = req.body;

    if (!latitude || !longitude || !radius || !rows_per_page || !page || !user_id) { return res.status(400).json() }
    if (req.session.user.id != user_id) { return res.status(403).json() }

    ; (async () => {
        const client = await pool.connect();
        try {

            let query = {
                text: `WITH all_fuel_stations AS (
                            SELECT
                                station_id,
                                brand_id,
                                latitude,
                                longitude,
                                earth_distance (ll_to_earth (latitude, longitude), ll_to_earth ($1, $2)) * 0.0006213 AS distance,
                                station_name,
                                address,
                                city,
                                state,
                                zip,
                                is_confirmed,
                                created_by
                            FROM
                                public.fuel_stations
                            WHERE (earth_distance (ll_to_earth (latitude, longitude), ll_to_earth ($1, $2)) * 0.0006213) <= $3
                        ORDER BY
                            distance
                        )
                        SELECT
                            *,
                            count(*) OVER () AS total
                        FROM
                            all_fuel_stations
                        LIMIT $4 offset (($5 - 1) * $4)`,
                values: [
                    latitude,
                    longitude,
                    radius,
                    rows_per_page,
                    page
                ]
            };

            let results = await client.query(query);
            if (results.rowCount > 0) {

                let formattedRows = {
                    'rows': [],
                    page,
                    rows_per_page,
                    total_rows: parseInt(results.rows[0].total),
                    radius
                };

                const removeTotalColumn = results.rows.map(({ total, ...item }) => { return item });
                formattedRows.rows = [...removeTotalColumn];

                res.status(200).json(formattedRows);
            } else {
                res.status(404).json();
            }
        } finally {
            // Make sure to release the client before any error handling,
            // just in case the error handling itself throws an error.
            client.release();
        }
    })().catch(err => {
        console.log(err);
        res.status(500).json({ code: err.code, message: err.message });
    });
});

router.put(`/api/fuel/stations`, (req, res) => {
    if (!req.session.user) { return res.status(401).json() }

    let {
        station_id,
        brand_id,
        latitude,
        longitude,
        station_name,
        address,
        city,
        state,
        zip,
        is_confirmed,
        user_id
    } = req.body;

    if (!user_id ||
        !station_id ||
        !latitude ||
        !longitude) { return res.status(400).json() }

    latitude = latitude.toString().trim();
    if (latitude.trim() === '') { return res.status(400).json() }

    longitude = longitude.toString().trim();
    if (longitude.trim() === '') { return res.status(400).json() }

    if (req.session.user.id != user_id) { return res.status(403).json() }

    ; (async () => {
        const client = await pool.connect();
        try {

            let query = {
                text: `UPDATE public.fuel_stations SET 
                            brand_id = $2,
                            latitude = $3,
                            longitude = $4,
                            station_name = $5,
                            address = $6,
                            city = $7,
                            state = $8,
                            zip = $9,
                            is_confirmed = $10
                       WHERE station_id = $1 
                       RETURNING station_id,
                                 brand_id,
                                 latitude,
                                 longitude,
                                 station_name,
                                 address,
                                 city,
                                 state,
                                 zip,
                                 is_confirmed`,
                values: [
                    station_id,
                    brand_id,
                    latitude,
                    longitude,
                    station_name,
                    address,
                    city,
                    state,
                    zip,
                    is_confirmed
                ]
            };

            let results = await client.query(query);
            if (results.rowCount > 0) {
                res.status(200).json(results.rows[0]);
            } else {
                res.status(404).json();
            }
        } finally {
            // Make sure to release the client before any error handling,
            // just in case the error handling itself throws an error.
            client.release();
        }
    })().catch(err => {
        res.status(500).json({ code: err.code, message: err.message });
    });
});

router.delete(`/api/fuel/stations`, (req, res) => {
    if (!req.session.user) { return res.status(401).json() }

    let {
        station_id,
        user_id
    } = req.body;

    if (req.session.user.id != user_id) { return res.status(403).json() }

    if (!station_id || !user_id) { return res.status(400).json() }

    let query = { text: '', values: [] };

    (async () => {
        // note: we don't try/catch this because if connecting throws an exception
        // we don't need to dispose of the client (it will be undefined)
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Create the queries
            query.text = `DELETE FROM public.fuel_stations WHERE station_id = $1 RETURNING station_id`;
            query.values = [station_id];
            let results = await client.query(query);
            await client.query("COMMIT");

            if (results.rowCount > 0) {
                res.status(200).json(results.rows);
            } else {
                res.status(404).json();
            }
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    })().catch((error) => {
        res.status(500).json(error.message);
    });
});

module.exports = router;