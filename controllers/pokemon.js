const helpers = require("../helpers");
const db = require("../db");

module.exports = {
    showNewPokemonForm: (request, response) => {
        response.render('newpokeform');
    },

    showEditPokemonForm: (request, response) => {
        let context;
        const queryString = 'SELECT * FROM pokemon WHERE id = $1';
        const value = [request.params.id];
        db.query(queryString, value, (err, result) => {
            if (err) {
                console.error('query error:', err.stack);
            } else {
                if (result.rows.length > 0) {
                    context = result.rows[0];
                    response.render('editpokeform', context);
                } else {
                    response.send('No matching pokemon!');
                }
            }
        });
    },

    pokemonCreate: (request, response) => {
        const queryString = 'INSERT INTO pokemon (name, img, weight, height) VALUES ($1, $2, $3, $4) RETURNING *';
        let values = [request.body.name,request.body.img,request.body.weight,request.body.height];
        db.query(queryString, values, (err, res) => {
            if (err) {
                console.error('query error:', err.stack);
            } else {
                if (res.rows.length > 0) {
                    const queryString2 = 'UPDATE pokemon SET num = $1 WHERE id = $2';
                    let currentPokeId = res.rows[0].id;
                    let currentPokeNum = helpers.generateNum(currentPokeId);
                    let values2 = [currentPokeNum, currentPokeId];
                    db.query(queryString2, values2, (error, result) => {
                        if (err) {
                            console.error('query error:', error.stack);
                        } else {
                            let currentUserId = request.cookies.user_id;
                            const queryString3 = 'INSERT INTO user_pokemon (username_id, pokemon_id) VALUES ($1, $2) RETURNING *';
                            let values3 = [currentUserId, currentPokeId];
                            db.query(queryString3, values3, (errr, ress) => {
                                if (errr) {
                                    console.error('query error:', errr.stack);
                                } else {
                                    request.flash('success', 'Pokemon added successfully!');
                                    response.redirect('/');
                                }
                            })
                        }
                    })
                } else {
                    response.send('Error in creating pokemon');
                }
            }
        })
    },

    pokemonRead: (request, response) => {
        const queryString = 'SELECT * FROM pokemon WHERE id = $1';
        let value = [request.params.id];
        db.query(queryString, value, (err, result) => {
            if (err) {
                console.error('query error:', err.stack);
            } else {
                if (result.rows.length > 0) {
                    let context = result.rows[0];
                    response.send(context);
                } else {
                    response.status(404);
                    response.send("not found");
                }
            }
        });
    },

    pokemonUpdate: (request, response) => {
        const queryString = 'UPDATE pokemon SET name = $1, img = $2, height = $3, weight = $4 WHERE id = $5';
        const values = [request.body.name, request.body.img, request.body.height, request.body.weight, request.params.id];
        db.query(queryString, values, (err, result) => {
            if (err) {
                console.error('query error:', err.stack);
            } else {
                request.flash('success', 'Pokemon updated successfully!');
                response.redirect('/');
            }
        });
    },

    pokemonDelete: (request, response) => {
        const queryString = 'DELETE FROM pokemon WHERE id = $1';
        const value = [request.params.id];

        db.query(queryString, value, (err, result) => {
            if (err) {
                console.error('query error:', err.stack);
                request.flash('error', 'Pokemon was not found!');
            } else {
                request.flash('success', 'Pokemon deleted successfully!');
            }
            response.redirect('/');
        });
    }
}