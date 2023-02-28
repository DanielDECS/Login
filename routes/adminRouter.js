const express = require('express');

const router = express.Router();

const auth = require('../controllers/authController');

router.get('/', auth, (req, res) => {

    if (req.user.admin) {
        res.send('Access admin only')
    }
    else {
        res.status(401).send('You are not admin, access denied')
    }
})

router.get('/free', auth, (req, res) => {
    res.send('You are loged, free access')
})

module.exports = router