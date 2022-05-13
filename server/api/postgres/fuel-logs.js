const express = require("express");
const router = express.Router();

const db = require("../../pg-pool");
const pool = db.getPool();

const resyncFuelLogs = async (client, vehicle_id, odometer) => {
    return await client.query({
        text: `WITH vehicle_fuel_logs AS
                    (SELECT log_id,
                            (odometer - lag(odometer) OVER (
                                                            ORDER BY odometer)) AS trip
                    FROM public.fuel_logs
                    WHERE vehicle_id = $1
                    AND odometer >= $2
                    OR odometer =
                        (SELECT odometer
                        FROM public.fuel_logs fl
                        WHERE vehicle_id = $1
                            AND odometer < $2
                        ORDER BY odometer DESC
                        LIMIT 1)
                    ORDER BY odometer)
                UPDATE public.fuel_logs pfl
                SET trip = vehicle_fuel_logs.trip
                FROM vehicle_fuel_logs
                WHERE pfl.log_id = vehicle_fuel_logs.log_id
                    AND vehicle_fuel_logs.trip IS NOT NULL RETURNING pfl.log_id,
                                                                     pfl.trip`,
        values: [vehicle_id, odometer]
    });
}

const querySelectFuelLogs = (fromTable) => {
    return `SELECT
                fl.log_id,
                fl.vehicle_id,
                fl.purchase_date,
                fl.gallons,
                fl.fuel_cost,
                fl.odometer,
                fl.trip,
                fl.octane_id,
                fo.octane,
                fl.brand_id,
                fb.brand,
                fl.station_id,
                fs2.latitude,
                fs2.longitude,
                fs2.address,
                fs2.city,
                fs2.state,
                fs2.zip,
                fs2.is_confirmed,
                fl.is_partial_fill,
                fl.is_ethonal_free,
                fl.is_excluded
            FROM
                ${fromTable} fl
            INNER JOIN public.vehicles v ON v.vehicle_id = fl.vehicle_id
            INNER JOIN public.fuel_brands fb ON fb.brand_id = fl.brand_id 
            INNER JOIN public.fuel_octanes fo ON fo.octane_id = fl.octane_id 
            INNER JOIN public.fuel_stations fs2 ON fs2.station_id = fl.station_id `;
}

const validateUserAuthorized = (req, res) => {
    if (!req.session.user) { return res.status(401).json() }
    return req.session.user;
}

router.post(`/api/fuel/logs/search`, (req, res) => {
    const user = validateUserAuthorized(req, res);

    let {
        rows_per_page,
        page,
        user_id,
        vehicle_id
    } = req.body;

    if (!rows_per_page || !page || !user_id || !vehicle_id) { return res.status(400).json() }
    if (user.id != user_id) { return res.status(403).json() }

    ; (async () => {
        let query = {
            text: `WITH all_fuel_logs AS (
                        ${querySelectFuelLogs('public.fuel_logs')}
                        WHERE
                            fl.vehicle_id = $1
                            AND v.user_id = $2
                        ORDER BY
                            odometer DESC
                    )
                    SELECT *, count(*) OVER () AS total
                    FROM all_fuel_logs LIMIT $3 OFFSET (($4 - 1) * $3)`,
            values: [vehicle_id, user_id, rows_per_page, page]
        }

        const { rows } = await pool.query(query);
        res.status(200).json(rows)
    })().catch(err => {
        res.status(500).json(err.message);
    });
});

router.post(`/api/fuel/logs`, (req, res) => {
    const user = validateUserAuthorized(req, res);

    let {
        vehicle_id,
        purchase_date,
        gallons,
        fuel_cost,
        odometer,
        octane_id,
        brand_id,
        station_id,
        is_partial_fill,
        is_ethonal_free,
        is_excluded,
        user_id
    } = req.body;

    if (!vehicle_id ||
        !purchase_date ||
        !gallons ||
        !fuel_cost ||
        !odometer ||
        !octane_id ||
        !brand_id ||
        !is_partial_fill ||
        !is_ethonal_free ||
        !is_excluded ||
        !user_id) { return res.status(400).json() }

    if (user.id != user_id) { return res.status(403).json() }
    if (!user.vehicles.includes(vehicle_id)) { return res.status(403).json() }

    let query = { text: '', values: [] };

    (async () => {
        // note: we don't try/catch this because if connecting throws an exception
        // we don't need to dispose of the client (it will be undefined)
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            query.text = `select
                                v.purchase_mileage, 
                                (select
                                    odometer
                                from
                                    public.fuel_logs
                                where
                                    vehicle_id = $1
                                    and odometer < $2
                                order by
                                    odometer desc
                                limit 1) as last_odometer
                            from
                                public.vehicles v 
                            where
                                v.vehicle_id = $1`;
            query.values = [vehicle_id, odometer];
            let calcTripResults = await client.query(query);
            let trip = 0;

            if (calcTripResults.rowCount > 0) {
                let row = calcTripResults.rows[0];
                let last_odometer = (row['last_odometer']) ? row['last_odometer'] : row['purchase_mileage'];
                trip = odometer - last_odometer;
            } else {
                return res.status(500).json();
            }

            query.text = `WITH cte_fuel_log AS (
                                INSERT INTO public.fuel_logs 
                                    (vehicle_id, purchase_date, gallons, fuel_cost, odometer, trip, octane_id, brand_id, station_id, is_partial_fill, is_ethonal_free, is_excluded) 
                                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
                                RETURNING *) ${querySelectFuelLogs('cte_fuel_log')} WHERE fl.log_id = fl.log_id`;
            query.values = [
                vehicle_id,
                purchase_date,
                gallons,
                fuel_cost,
                odometer,
                trip,
                octane_id,
                brand_id,
                station_id,
                is_partial_fill,
                is_ethonal_free,
                is_excluded
            ];
            let updateLogResults = await client.query(query);
            let updateTripResults = await resyncFuelLogs(client, vehicle_id, odometer);

            await client.query("COMMIT");

            if (updateLogResults.rowCount > 0) {
                return res.status(201).json({
                    log: updateLogResults.rows,
                    trip: updateTripResults.rows
                });
            } else {
                return res.status(404).json();
            }
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    })().catch((error) => {
        return res.status(500).json(error);
    });
});

router.put(`/api/fuel/logs`, (req, res) => {
    const user = validateUserAuthorized(req, res);

    let {
        log_id,
        vehicle_id,
        purchase_date,
        gallons,
        fuel_cost,
        odometer,
        octane_id,
        brand_id,
        station_id,
        is_partial_fill,
        is_ethonal_free,
        is_excluded,
        user_id
    } = req.body;

    if (!log_id ||
        !vehicle_id ||
        !purchase_date ||
        !gallons ||
        !fuel_cost ||
        !odometer ||
        !octane_id ||
        !brand_id ||
        !is_partial_fill ||
        !is_ethonal_free ||
        !is_excluded ||
        !user_id) { return res.status(400).json() }

    if (user.id != user_id) { return res.status(403).json() }

    let query = { text: '', values: [] };

    (async () => {
        // note: we don't try/catch this because if connecting throws an exception
        // we don't need to dispose of the client (it will be undefined)
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Create the queries
            query.text = `select
                                v.purchase_mileage, 
                                (select
                                    odometer
                                from
                                    public.fuel_logs
                                where
                                    log_id <> $1
                                    and vehicle_id = $2
                                    and odometer < $3
                                order by
                                    odometer desc
                                limit 1) as last_odometer
                            from
                                public.vehicles v 
                            where
                                v.vehicle_id = $2`;
            query.values = [log_id, vehicle_id, odometer];
            let calcTripResults = await client.query(query);
            let trip = 0;

            if (calcTripResults.rowCount > 0) {
                let row = calcTripResults.rows[0];
                let last_odometer = (row['last_odometer']) ? row['last_odometer'] : row['purchase_mileage'];
                trip = odometer - last_odometer;
            } else {
                return res.status(500).json();
            }

            query.text = `WITH cte_fuel_log AS (
                                UPDATE public.fuel_logs SET 
                                            vehicle_id = $2,
                                            purchase_date = $3,
                                            gallons = $4,
                                            fuel_cost = $5,
                                            odometer = $6,
                                            trip = $7,
                                            octane_id = $8,
                                            brand_id = $9,
                                            station_id = $10,
                                            is_partial_fill = $11,
                                            is_ethonal_free = $12,
                                            is_excluded = $13
                                WHERE log_id = $1 RETURNING *) ${querySelectFuelLogs('cte_fuel_log')} WHERE fl.log_id = $1`;
            query.values = [
                log_id,
                vehicle_id,
                purchase_date,
                gallons,
                fuel_cost,
                odometer,
                trip,
                octane_id,
                brand_id,
                station_id,
                is_partial_fill,
                is_ethonal_free,
                is_excluded
            ];
            let updateLogResults = await client.query(query);
            let updateTripResults = await resyncFuelLogs(client, vehicle_id, odometer);

            await client.query("COMMIT");

            if (updateLogResults.rowCount > 0) {
                return res.status(200).json({
                    log: updateLogResults.rows,
                    trip: updateTripResults.rows
                });
            } else {
                return res.status(404).json();
            }
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    })().catch((error) => {
        return res.status(500).json(error.message);
    });
});

router.delete(`/api/fuel/logs`, (req, res) => {
    const user = validateUserAuthorized(req, res);

    let {
        log_id,
        user_id
    } = req.body;

    if (user.id != user_id) { return res.status(403).json() }

    if (!log_id || !user_id) { return res.status(400).json() }

    let query = { text: '', values: [] };

    (async () => {
        // note: we don't try/catch this because if connecting throws an exception
        // we don't need to dispose of the client (it will be undefined)
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Create the queries
            query.text = `DELETE FROM public.fuel_logs fl USING public.vehicles v
                            WHERE
                                fl.vehicle_id = v.vehicle_id 
                                AND fl.log_id = $1 
                                AND v.user_id = $2
                            RETURNING fl.log_id, fl.vehicle_id, fl.odometer`;
            query.values = [log_id, user_id];
            let deleteLogResults = await client.query(query);
            let updateTripResults;

            if (deleteLogResults.rowCount > 0) {
                let odometer = deleteLogResults.rows[0]['odometer'];
                let vehicle_id = deleteLogResults.rows[0]['vehicle_id'];
                updateTripResults = await resyncFuelLogs(client, vehicle_id, odometer);

                await client.query("COMMIT");

                return res.status(200).json({
                    log: deleteLogResults.rows,
                    trip: updateTripResults ? updateTripResults.rows : []
                });
            } else {
                return res.status(404).json();
            }
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    })().catch((error) => {
        return res.status(500).json(error.message);
    });
});

module.exports = router;