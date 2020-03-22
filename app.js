const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const crypto = require('crypto');
const routes = require('./routes');
const connection = require('./config/database');

const MongoStore = require('connect-mongo')(session);

/**
 * -------------- MOCK DATA ----------------
 */

const users = [
    {
        id: 1,
        name: {
            first: 'f',
            last: 'l'
        },
    }
];

const teams = [
    {
        id: 1,
        contact: {},
    }
];

const accounts = [
    {
        id: 1,
        contact: {},
        billing: {},
        units: [1, 2]
    }
];

const units = [
    {
        id: 1,
        address: {
            street: 'a'
        },
        notes: {},
    },
    {
        id: 2,
        address: {
            street: 'b'
        },
        notes: {},
    }
];

/**
 * -------------- GENERAL SETUP ----------------
 */

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


/**
 * -------------- SESSION SETUP ----------------
 */

const sessionStore = new MongoStore({ 
    mongooseConnection: connection, 
    collection: 'sessions' 
});

const sessionOptions = {
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    }
};

app.use(session(sessionOptions));

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next();
});

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);


app.get('/', (req, res, next) => {
    
    if (req.session.viewCount) {
        req.session.viewCount = req.session.viewCount + 1;
    } else {
        req.session.viewCount = 1;
    }

    res.send(`<h1>You have visited this page ${req.session.viewCount} times.</h1>`);
});

app.get('/account/:id', (req, res) => {
    const account = accounts.find(acc => acc.id === parseInt(req.params.id));
    res.send(account);
});

app.get('/unit/:id', (req, res) => {
    const unit = units.find(un => un.id === parseInt(req.params.id));
    res.send(unit);
});

app.get('/team/:id', (req, res) => {
    const team = teams.find(tm => tm.id === parseInt(req.params.id));
    res.send(team);
});

app.get('/user/:id', (req, res) => {
    const user = users.find(us => us.id === parseInt(req.params.id));
    res.send(user);
});

app.listen(3000, () => {
    console.log('to rodando');
});