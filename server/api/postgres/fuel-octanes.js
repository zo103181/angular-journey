const express = require("express");
const router = express.Router();

const db = require("../../pg-pool");
const pool = db.getPool();

router.get(`/api/fuel/octanes`, (req, res) => {
    ; (async () => {
        const { rows } = await pool.query(`select octane_id, octane from public.fuel_octanes`)
        res.status(200).json(rows)
    })().catch(err => {
        res.status(500).json(err.message);
    });
});

router.post(`/api/fuel/octanes`, (req, res) => {
    if (!req.session.user) { return res.status(401).json() }

    let {
        user_id,
        octane
    } = req.body;

    if (!octane || !user_id) { return res.status(400).json() }

    octane = octane.trim();
    if (octane.trim() === '') { return res.status(400).json() }

    if (req.session.user.id != user_id) { return res.status(403).json() }

    ; (async () => {
        const client = await pool.connect();
        try {

            let query = {
                text: `INSERT INTO public.fuel_octanes (
                            octane,
                            created_by
                        ) VALUES ($1, $2) 
                        RETURNING octane_id,
                                  octane`,
                values: [
                    octane,
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
        res.status(500).json({ code: err.code, message: err.message });
    });
});

router.put(`/api/fuel/octanes`, (req, res) => {
    if (!req.session.user) { return res.status(401).json() }

    let {
        octane_id,
        octane,
        user_id
    } = req.body;

    if (!octane_id || !octane || !user_id) { return res.status(400).json() }

    octane = octane.trim();
    if (octane.trim() === '') { return res.status(400).json() }

    if (req.session.user.id != user_id) { return res.status(403).json() }

    ; (async () => {
        const client = await pool.connect();
        try {

            let query = {
                text: `UPDATE public.fuel_octanes SET octane = $2
                       WHERE octane_id = $1 
                       RETURNING octane_id, octane`,
                values: [
                    octane_id,
                    octane
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

router.delete(`/api/fuel/octanes`, (req, res) => {
    if (!req.session.user) { return res.status(401).json() }

    let {
        octane_id,
        user_id
    } = req.body;

    if (req.session.user.id != user_id) { return res.status(403).json() }

    if (!octane_id || !user_id) { return res.status(400).json() }

    let query = { text: '', values: [] };

    (async () => {
        // note: we don't try/catch this because if connecting throws an exception
        // we don't need to dispose of the client (it will be undefined)
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Create the queries
            query.text = `DELETE FROM public.fuel_octanes WHERE octane_id = $1 RETURNING octane_id`;
            query.values = [octane_id];
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