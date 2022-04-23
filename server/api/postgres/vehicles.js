const express = require("express");
const router = express.Router();

const db = require("../../pg-pool");
const pool = db.getPool();

router.get(`/api/vehicles/:user_uid`, (req, res) => {
    const { user_uid } = req.params;

    if (!req.session.user) { return res.status(401).json() }

    ; (async () => {
        const { rows } = await pool.query(
            `SELECT
                v.vehicle_id,
                v.user_id,
                v."year",
                v.manufacturer,
                v.model,
                v.color,
                v.bodystyle,
                v.motor,
                v.motor_type,
                v.transmission,
                v.drivetrain,
                v.interior,
                v.nickname,
                v.purchase_date,
                v.purchase_price,
                v.purchase_mileage,
                v.sold_date,
                v.sold_price,
                v.sold_mileage,
                v.vin
            FROM
                public.vehicles v
            INNER JOIN public.users u on
                u.user_id = v.user_id
            WHERE
                u.uid = $1 ORDER BY v.manufacturer ASC`,
            [user_uid]);

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
                v.vehicle_id,
                v.user_id,
                v."year",
                v.manufacturer,
                v.model,
                v.color,
                v.bodystyle,
                v.motor,
                v.motor_type,
                v.transmission,
                v.drivetrain,
                v.interior,
                v.nickname,
                v.purchase_date,
                v.purchase_price,
                v.purchase_mileage,
                v.sold_date,
                v.sold_price,
                v.sold_mileage,
                v.vin
            FROM
                public.vehicles v
            INNER JOIN public.users u on
                u.user_id = v.user_id
            WHERE
                v.vehicle_id = $1`,
            [vehicle_id]);

        if (rows.length === 0) {
            res.status(404).json();
        } else {
            res.json(rows[0]);
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
        motor,
        motor_type,
        transmission,
        drivetrain,
        interior,
        nickname,
        purchase_date,
        purchase_price,
        purchase_mileage,
        sold_date,
        sold_price,
        sold_mileage,
        vin
    } = req.body;

    if (req.session.user.id != user_id) { return res.status(403).json() }

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
                            motor,
                            motor_type,
                            transmission,
                            drivetrain,
                            interior,
                            nickname,
                            purchase_date,
                            purchase_price,
                            purchase_mileage,
                            sold_date,
                            sold_price,
                            sold_mileage,
                            vin
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) 
                        RETURNING vehicle_id,
                                  user_id, 
                                  year, 
                                  manufacturer, 
                                  model, 
                                  color, 
                                  bodystyle,
                                  motor,
                                  motor_type,
                                  transmission, 
                                  drivetrain, 
                                  interior,  
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
                    motor,
                    motor_type,
                    transmission,
                    drivetrain,
                    interior,
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
            res.status(201).json(results.rows[0]);
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
        user_id,
        year,
        manufacturer,
        model,
        color,
        bodystyle,
        motor,
        motor_type,
        transmission,
        drivetrain,
        interior,
        nickname,
        purchase_date,
        purchase_price,
        purchase_mileage,
        sold_date,
        sold_price,
        sold_mileage,
        vin
    } = req.body;

    if (req.session.user.id != user_id) { return res.status(403).json() }

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
            motor = $8,
            motor_type = $9,
            transmission = $10, 
            drivetrain = $11, 
            interior = $12, 
            nickname = $13, 
            purchase_date = $14, 
            purchase_price = $15, 
            purchase_mileage = $16, 
            sold_date = $17, 
            sold_price = $18, 
            sold_mileage = $19, 
            vin = $20
        WHERE vehicle_id = $1 AND user_id = $2
        RETURNING vehicle_id,
                  user_id,
                  year,
                  manufacturer,
                  model,
                  color,
                  bodystyle,
                  motor,
                  motor_type,
                  transmission,
                  drivetrain,
                  interior,
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
            user_id,
            year,
            manufacturer,
            model,
            color,
            bodystyle,
            motor,
            motor_type,
            transmission,
            drivetrain,
            interior,
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
            res.status(500).json('Unknown Error: SQL Query');
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
                res.status(200).json(vehicle_id);
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