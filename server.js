const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')
const bodyParser = require('body-parser')
const app = express()

//Mongodb connection
const URI = require('./config/database')
mongoose.connect(URI,{
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(() => {console.log('db connected')})
.catch(() => {console.warn('db connection failed!')})

require('./config/passport')(passport)

//Static files
app.use(express.static(__dirname + '/public'))

//Express body-parser
app.use(bodyParser.urlencoded({
    extended : true
}))
app.use(bodyParser.json())

//Express Session
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}))

//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())


//EJS
//app.use(expressLayouts)
app.set('view engine', 'ejs')


//connect flash
app.use(flash())

//Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})

//Routes
app.use('/', require('./routes/index'))
app.use('/user', require('./routes/user'))


const PORT = process.env.PORT || 3000
app.listen(PORT, console.log(`server listening at port : ${PORT}`))


