const router = require('express').Router();
const { users, teams, accounts, units } = require('../mockdata');

router.get('/', (req, res, next) => {
    
    if (req.session.viewCount) {
        req.session.viewCount = req.session.viewCount + 1;
    } else {
        req.session.viewCount = 1;
    }

    res.send(`<h1>You have visited this page ${req.session.viewCount} times.</h1>`);
});

router.get('/account/:id', (req, res) => {
    const account = accounts.find(acc => acc.id === parseInt(req.params.id));
    res.send(account);
});

router.get('/unit/:id', (req, res) => {
    const unit = units.find(un => un.id === parseInt(req.params.id));
    res.send(unit);
});

router.get('/team/:id', (req, res) => {
    const team = teams.find(tm => tm.id === parseInt(req.params.id));
    res.send(team);
});

router.get('/user/:id', (req, res) => {
    const user = users.find(us => us.id === parseInt(req.params.id));
    res.send(user);
});

module.exports = router;