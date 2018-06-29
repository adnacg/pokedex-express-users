const helpers = require("../helpers");
const db = require("../db");
const cookieParser = require('cookie-parser');
const sha256 = require('js-sha256');

module.exports = {
    showCreationForm: (request, response) => {
        response.render('newuserform');
    },

    userCreate: (request, response) => {
        let username = request.body.username;
        let password = request.body.password;
        let passwordHash = sha256(password);
        let queryText = 'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *';
        let values = [username, passwordHash];
        db.query(queryText, values, (err, res) => {
            if (err) {
                console.log("Error creating user:", err);
                response.status(401);
            } else {
                let userId = res.rows[0].id;
                response.cookie('logged_in', 'true');
                response.cookie('user_id', userId);
                request.flash('success', 'Successfully created account.');
                response.redirect('/');
            }
        })
    },
}