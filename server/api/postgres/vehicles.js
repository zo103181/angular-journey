const express = require("express");
const router = express.Router();

const db = require("../../pg-pool");
const pool = db.getPool();

router.get(`/api/vehicles/:user_uid`, (req, res) => {
    const { user_uid } = req.params;

    if (!req.session.user) { return res.status(401).json() }
    if (req.session.user.uid !== user_uid) { return res.status(403).json() }

    ; (async () => {
        const { rows } = await pool.query(
            `SELECT 
                vehicle_id,
                "year",
                manufacturer,
                model,
                color,
                bodystyle,
                interior,
                engine,
                transmission,
                drivetrain,
                nickname,
                purchase_date,
                purchase_price,
                purchase_mileage,
                sold_date,
                sold_price,
                sold_mileage,
                vin
            FROM public.vehicles WHERE user_id = $1`,
            [req.session.user.id]);

        res.json(rows);
    })().catch(err => {
        res.status(500).json(err.message);
    });
});

router.get(`/api/vehicle/:vehicle_id`, (req, res) => {
    ; (async () => {
        const { vehicle_id } = req.params;

        const { rows } = await pool.query(
            `SELECT 
                vehicle_id,
                user_id,
                "year",
                manufacturer,
                model,
                color,
                bodystyle,
                interior,
                engine,
                transmission,
                drivetrain,
                nickname,
                purchase_date,
                purchase_price,
                purchase_mileage,
                sold_date,
                sold_price,
                sold_mileage,
                vin
            FROM public.vehicles WHERE vehicle_id = $1`,
            [vehicle_id]);

        if (rows.length === 0) {
            res.status(404).json();
        } else {
            res.json(rows);
        }
    })().catch(err => {
        res.status(500).json(err.message);
    });
});

router.post(`/api/vehicle`, (req, res) => {
    if (!req.session.user) { return res.status(401).json() }

    const {
        user_id,
        year,
        manufacturer,
        model,
        color,
        bodystyle,
        interior,
        engine,
        transmission,
        drivetrain,
        nickname,
        purchase_date,
        purchase_price,
        purchase_mileage,
        sold_date,
        sold_price,
        sold_mileage,
        vin
    } = req.body;

    ; (async () => {
        const client = await pool.connect();
        try {

            let query = {
                text: `INSERT INTO public.vehicles (
                            user_id,
                            "year",
                            manufacturer,
                            model,
                            color,
                            bodystyle,
                            interior,
                            engine,
                            transmission,
                            drivetrain,
                            nickname,
                            purchase_date,
                            purchase_price,
                            purchase_mileage,
                            sold_date,
                            sold_price,
                            sold_mileage,
                            vin
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) 
                        RETURNING vehicle_id,
                                  user_id, 
                                  year, 
                                  manufacturer, 
                                  model, 
                                  color, 
                                  bodystyle, 
                                  interior, 
                                  engine, 
                                  transmission, 
                                  drivetrain, 
                                  nickname, 
                                  purchase_date, 
                                  purchase_price, 
                                  purchase_mileage, 
                                  sold_date, 
                                  sold_price, 
                                  sold_mileage, 
                                  vin`,
                values: [
                    user_id,
                    year,
                    manufacturer,
                    model,
                    color,
                    bodystyle,
                    interior,
                    engine,
                    transmission,
                    drivetrain,
                    nickname,
                    purchase_date,
                    purchase_price,
                    purchase_mileage,
                    sold_date,
                    sold_price,
                    sold_mileage,
                    vin
                ]
            };

            let results = await client.query(query);
            res.status(201).json(results.rows);
        } finally {
            // Make sure to release the client before any error handling,
            // just in case the error handling itself throws an error.
            client.release();
        }
    })().catch(err => {
        res.status(500).json({ code: err.code, message: err.message });
    });
});

router.put(`/api/vehicle`, (req, res) => {
    if (!req.session.user) { return res.status(401).json() }

    const {
        vehicle_id,
        user_uid,
        year,
        manufacturer,
        model,
        color,
        bodystyle,
        interior,
        engine,
        transmission,
        drivetrain,
        nickname,
        purchase_date,
        purchase_price,
        purchase_mileage,
        sold_date,
        sold_price,
        sold_mileage,
        vin
    } = req.body;

    if (req.session.user.uid !== user_uid) { return res.status(403).json() }

    let query = {
        text: ``,
        values: []
    }

    query = {
        text: `
        UPDATE public.vehicles 
        SET year = $3, 
            manufacturer = $4, 
            model = $5, 
            color = $6, 
            bodystyle = $7,
            interior = $8, 
            engine = $9, 
            transmission = $10, 
            drivetrain = $11, 
            nickname = $12, 
            purchase_date = $13, 
            purchase_price = $14, 
            purchase_mileage = $15, 
            sold_date = $16, 
            sold_price = $17, 
            sold_mileage = $18, 
            vin = $19
        WHERE vehicle_id = $1 AND user_id = (SELECT user_id FROM public.users WHERE uid = $2)
        RETURNING vehicle_id,
                  year,
                  manufacturer,
                  model,
                  color,
                  bodystyle,
                  interior,
                  engine,
                  transmission,
                  drivetrain,
                  nickname,
                  purchase_date,
                  purchase_price,
                  purchase_mileage,
                  sold_date,
                  sold_price,
                  sold_mileage,
                  vin`,
        values: [
            vehicle_id,
            user_uid,
            year,
            manufacturer,
            model,
            color,
            bodystyle,
            interior,
            engine,
            transmission,
            drivetrain,
            nickname,
            purchase_date,
            purchase_price,
            purchase_mileage,
            sold_date,
            sold_price,
            sold_mileage,
            vin
        ]
    }

    pool.query(query, (error, results) => {
        if (error) {
            response.status(500).json('Unknown Error: SQL Query');
            return console.error("Error executing query", error.stack);
        }
        res.status(200).json(results.rows);
    });
});

router.delete(`/api/vehicle`, (req, res) => {
    if (!req.session.user) { return res.status(401).json() }

    const {
        vehicle_id,
        user_uid
    } = req.body;

    if (req.session.user.uid !== user_uid) { return res.status(403).json() }

    let query = { text: '', values: [] };

    (async () => {
        // note: we don't try/catch this because if connecting throws an exception
        // we don't need to dispose of the client (it will be undefined)
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Create the queries
            query.text = `DELETE FROM public.vehicles WHERE vehicle_id = $1 AND user_id = (SELECT user_id FROM public.users WHERE uid = $2) RETURNING vehicle_id`;
            query.values = [vehicle_id, user_uid];
            let results = await client.query(query);
            await client.query("COMMIT");

            if (results.rowCount > 0) {
                res.status(200).json({ "vehicle_id": vehicle_id });
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