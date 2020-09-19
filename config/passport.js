const LocalStrategy  = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

//Load user model
const User = require('../models/user')

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField : 'email'}, (email, password, done) => {
        User.findOne({email : email}).then((user) => {
            //Match User
            if(!user){
                return done(null, false, {message : 'E-mail not registered!'})
            }
            //Match Password
            bcrypt.compare(password, user.password, (err, isMatch)=> {
                if(err)
                    throw err
                if(isMatch)
                    return done(null, user) // User found
                else return done(null, false, {message : 'Password Incorrect'})
            })
        })
    }))

    passport.serializeUser((user, done) => {
            done(null, user.id)
    })
    
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}




