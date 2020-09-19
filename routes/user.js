const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const auth = require('../config/auth')
const forwardAuthenticated = auth.forwardAuthenticated
const ensureAuthenticated = auth.ensureAuthenticated
//Register page
router.get('/register', forwardAuthenticated, (req, res) => {
    res.render('register')
})

//Register
router.post('/register', (req, res) => {
    var name = req.body.name,
          email = req.body.email,
          contact = req.body.contact,
          password = req.body.password,
          confPassword = req.body.confpassword
    
    let errors = []

    if(!name || !email || !contact || !password || !confPassword)
        errors.push({msg : 'All fields are required'})
    
    if(password != confPassword)
        errors.push({msg : 'Password not matched'})
    
    if(password.length < 6)
        errors.push({msg : 'Password must be at least 6 characters'})
    
    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            contact,
            confPassword
        })
    }
    else{
        User.findOne({email : email}).then((user) => {
            if(user){
                errors.push({msg : 'Email already exist!'})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    contact,
                    confPassword
                })
            }
            else{
                bcrypt.hash(password, 10, (err, hash) => {
                    if(err)
                        throw err
                    
                    const newUser = new User({
                        _id : new mongoose.Types.ObjectId,
                        name,
                        email,
                        contact,
                        password : hash
                    })
                    newUser.save().then((result) => {
                        req.flash('success_msg', 'You are now registered and can log in')
                        res.redirect('/user/login')
                    })
                    .catch((err) => {console.warn(err)})
                })
            }
        })

    }
})

//Login Page
router.get('/login', forwardAuthenticated, (req, res) => {
    res.render('login')
})

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/user/login', successRedirect : '/dashboard', failureFlash : true}),
  function(req, res) {
  });

router.get('/logout', (req, res) => {
    req.logOut()
    req.flash('success_msg', 'You are logged out!')
    res.redirect('/user/login')
})
module.exports = router