const express = require('express');
const methodOverride = require('method-override');
const handlebars = require('express-handlebars');
const path = require('path');
const jsonfile = require('jsonfile');
const flash = require('connect-flash');
const session = require('express-session');
const sha256 = require('js-sha256');

const db = require("./db");
const helpers = require("./helpers");
// load the router module in the app
const pokemon = require('./routes/pokemon');
const user = require('./routes/user');

const FILE = 'pokedex.json';

/** * ===================================
 * Configurations and set up
 * =================================== */

// Init express app
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true }
}));
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = req.flash();

  next();
});

// set react to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.engine('jsx', reactEngine);
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');

/** * ===================================
 * Routes
 * =================================== */

// use the pokemon router
app.use('/pokemon', pokemon);
// use the user router
app.use('/user', user);

// Root handler
app.get('/', (request, response) => {
    let queryString;
    if (request.query.sortby == "name") {
        queryString = 'SELECT * FROM pokemon ORDER BY name ASC';
    } else {
        queryString = 'SELECT * FROM pokemon ORDER BY id ASC';
    }

    db.query(queryString, (err, result) => {
        if (err) {
            console.error('query error:', err.stack);
        } else {
            let pokeinfo = result.rows.map( pokemon => { return { "name": pokemon.name, "id": pokemon.id, "num": pokemon.num, "img": pokemon.img }; })
            let context = { pokeinfo };
            // pokeinfo = pokeinfo.sort(helpers.sortObject);
            response.render('home', context);
        }
    });
});

app.get('/signin', (request, response) => {
  response.render('signinform');
});

app.post('/signin', (request, response) => {
  let enteredUsername = request.body.username;
  let enteredPasswordHash = sha256(request.body.password);
  let queryText = 'SELECT * FROM users WHERE username = $1';
  let value = [enteredUsername];
  db.query(queryText, value, (err, res) => {
    if (err) {
      console.log("Error signing in:", err);
      response.status(401);
    } else {
      if (res.rows.length < 1) {
        request.flash('error', 'No such account!');
        response.redirect('/');
      };
      console.log('checking password');
      if (enteredPasswordHash !== res.rows[0].password_hash) {
        request.flash('error', 'Please check your password.');
        response.redirect('/');
      };
      console.log('creating cookies');
      response.cookie('logged_in', 'true');
      response.cookie('user_id', res.rows[0].id);
      request.flash('success', 'Successfully signed in!');
      response.redirect('/');
    };
  });
});

app.post('/signout', (request, response) => {
    response.clearCookie('user_id');
    response.clearCookie('logged_in');
    response.redirect('/');
});

/** * ===================================
 * Listen to requests on port 3000
 * =================================== */

app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));