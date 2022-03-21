const express = require("express");
const router = express.Router();

const db = require("../../pg-pool");
const pool = db.getPool();

router.get(`/api/user/:uid`, (req, res) => {
    ; (async () => {
        const { uid } = req.params;

        const { rows } = await pool.query(
            `SELECT 
            id,
            uid, 
            displayname, 
            email, 
            emailverified, 
            photourl,
            coverphotourl
        FROM public.users WHERE uid = $1`,
            [uid]);

        if (rows.length !== 1) {
            request.session.user = null;
            res.status(500).json("Could not find this user");
        } else {
            const user = {
                'uid': rows[0].uid,
                'email': rows[0].email,
                'photoURL': rows[0].photourl,
                'displayName': rows[0].displayname,
                'emailVerified': rows[0].emailverified,
                'coverPhotoURL': rows[0].coverphotourl
            };

            req.session.user = {
                id: rows[0].id,
                uid: rows[0].uid
            };

            res.json(user);
        }
    })().catch(err => {
        res.status(500).json(err.message);
    })
});

router.post(`/api/user`, (req, res) => {
    const {
        uid, displayName, email,
        emailVerified, photoURL
    } = JSON.parse(req.body.user);

    ; (async () => {
        const client = await pool.connect();
        try {

            let query;
            if (displayName) {
                query = {
                    text: `INSERT INTO public.users (
                      uid, 
                      displayname, 
                      email, 
                      emailverified, 
                      photourl
                  ) VALUES ($1, $2, $3, $4, $5) 
                  ON CONFLICT ON CONSTRAINT users_email_ukey
                  DO UPDATE SET uid = EXCLUDED.uid, 
                                displayname = EXCLUDED.displayname,
                                email = EXCLUDED.email,
                                emailverified = EXCLUDED.emailverified,
                                photourl = EXCLUDED.photourl
                  RETURNING uid, displayname, email, emailverified, photourl`,
                    values: [uid, displayName, email, emailVerified, photoURL]
                }
            } else {
                query = {
                    text: `INSERT INTO public.users (
                      uid,  
                      email, 
                      emailverified, 
                      photourl
                  ) VALUES ($1, $2, $3, $4) 
                  ON CONFLICT ON CONSTRAINT users_email_ukey
                  DO UPDATE SET uid = EXCLUDED.uid, 
                                email = EXCLUDED.email,
                                emailverified = EXCLUDED.emailverified,
                                photourl = EXCLUDED.photourl
                  RETURNING uid, displayname, email, emailverified, photourl`,
                    values: [uid, email, emailVerified, photoURL]
                }
            }

            let results = await client.query(query);
            if (results.rowCount === 1) {
                results = {
                    uid, displayName, email, emailVerified, photoURL
                };
            }

            res.status(201).json(results);
        } finally {
            // Make sure to release the client before any error handling,
            // just in case the error handling itself throws an error.
            client.release();
        }
    })().catch(err => {
        res.status(500).json(err.message);
    });
});

router.put(`/api/user/:uid`, (request, response) => {
    const { uid } = request.params;

    const { displayName, email, photoURL, coverPhotoURL } = request.body;

    if (!photoURL && !coverPhotoURL) {
        if (!displayName) { return response.status(400).json("Displayname is required.") }
        if (!email) { return response.status(400).json("Email is required.") }
    }

    const returnColumns = 'uid, displayname, email, emailverified, photourl, coverphotourl'

    let query = {
        text: ``,
        values: []
    }

    if (photoURL !== undefined || coverPhotoURL !== undefined) {
        if (photoURL !== undefined) {
            query = {
                text: `UPDATE public.users SET photourl = $2 WHERE uid = $1 RETURNING ${returnColumns}`,
                values: [uid, photoURL]
            }
        } else {
            query = {
                text: `UPDATE public.users SET coverphotourl = $2 WHERE uid = $1 RETURNING ${returnColumns}`,
                values: [uid, coverPhotoURL]
            }
        }
    } else {
        query = {
            text: `UPDATE public.users SET displayname = $2, email = $3 WHERE uid = $1 RETURNING ${returnColumns}`,
            values: [uid, displayName, email]
        }
    }

    pool.query(query, (error, results) => {
        if (error) {
            response.status(500).json('Unknown Error: SQL Query');
            return console.error("Error executing query", error.stack);
        }

        let responseUserData = null;
        if (results.rows.length > 0) {
            const row = results.rows[0];
            responseUserData = {
                uid,
                displayName: row.displayname,
                email,
                emailVerified: row.emailverified,
                photoURL: row.photourl
            };
        }
        response.status(200).json(responseUserData);
    });
});

module.exports = router;