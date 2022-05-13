const express = require("express");
const router = express.Router();

const db = require("../../pg-pool");
const pool = db.getPool();

router.get(`/api/fuel/brands`, (req, res) => {
    ; (async () => {
        const { rows } = await pool.query(`select brand_id, brand from public.fuel_brands`)
        res.status(200).json(rows)
    })().catch(err => {
        res.status(500).json(err.message);
    });
});

router.post(`/api/fuel/brands`, (req, res) => {
    if (!req.session.user) { return res.status(401).json() }

    let {
        user_id,
        brand
    } = req.body;

    if (!brand || !user_id) { return res.status(400).json() }

    brand = brand.trim();
    if (brand.trim() === '') { return res.status(400).json() }

    if (req.session.user.id != user_id) { return res.status(403).json() }

    ; (async () => {
        const client = await pool.connect();
        try {

            let query = {
                text: `INSERT INTO public.fuel_brands (
                            brand,
                            created_by
                        ) VALUES ($1, $2) 
                        RETURNING brand_id,
                                  brand`,
                values: [
                    brand,
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

router.put(`/api/fuel/brands`, (req, res) => {
    if (!req.session.user) { return res.status(401).json() }

    let {
        brand_id,
        brand,
        user_id
    } = req.body;

    if (!brand_id || brand || !user_id) { return res.status(400).json() }

    brand = brand.trim();
    if (brand.trim() === '') { return res.status(400).json() }

    if (req.session.user.id != user_id) { return res.status(403).json() }

    ; (async () => {
        const client = await pool.connect();
        try {

            let query = {
                text: `UPDATE public.fuel_brands SET brand = $2
                       WHERE brand_id = $1 
                       RETURNING brand_id, brand`,
                values: [
                    brand_id,
                    brand
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

router.delete(`/api/fuel/brands`, (req, res) => {
    if (!req.session.user) { return res.status(401).json() }

    let {
        brand_id,
        user_id
    } = req.body;

    if (req.session.user.id != user_id) { return res.status(403).json() }

    if (!brand_id || !user_id) { return res.status(400).json() }

    let query = { text: '', values: [] };

    (async () => {
        // note: we don't try/catch this because if connecting throws an exception
        // we don't need to dispose of the client (it will be undefined)
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Create the queries
            query.text = `DELETE FROM public.fuel_brands WHERE brand_id = $1 RETURNING brand_id`;
            query.values = [brand_id];
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