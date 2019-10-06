const express = require('express')
const expressLayouts = require('express-ejs-layouts')

const passport = require('passport')
const mongoose = require('mongoose')

const flash = require('connect-flash')
const session = require('express-session')

require('dotenv').config()

// setting up express
const app = express()

// passport
require('./config/passport')(passport)

// DB Config
const db = require('./config/keys').MongoURI

// Mongo Connection
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))

// Mongoose Deprecations Fixes
mongoose.set('useFindAndModify', false)

// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

// Parser for form data
app.use(express.urlencoded({ extended: false }))

// session
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  })
)
app.use(passport.initialize())
app.use(passport.session())
//flash
app.use(flash())

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_message')
  res.locals.error_msg = req.flash('error_message')
  res.locals.error = req.flash('error')
  next()
})

// TODO: Allow user to edit their name && email
// possibly allow them to see other user's profile?

const PORT = process.env.PORT || 5000

// Routes
app.use('/', require('./routes/index.js'))
app.use('/users', require('./routes/users'))
app.use('/user', require('./routes/user'))

app.listen(PORT, console.log(`listening on port ${PORT}`))
