const express = require('express')
const router = express.Router()
const {ensureAuthenticated, forwardAuthenticated} = require('../config/auth')
router.get('/', (req, res) => {
    res.render('home')
})

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard')
})
module.exports = router