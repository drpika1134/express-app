const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

// user model
const User = require('../models/User')

module.exports = function(passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email'
      },
      (email, password, done) => {
        // Find User
        User.findOne({ email })
          .then(user => {
            if (!user) {
              return done(null, false, { message: 'No User Found' })
            }

            // Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err

              if (isMatch) {
                return done(null, user)
              } else {
                return done(null, false, { message: 'Incorrect Password' })
              }
            })
          })
          .catch(err => console.log(err))
      }
    )
  )

  /* 
      serializeUser - can access the user object we passed
                      back to the middleware.
                      Its job is to determine that data is stored in the req.session
      The result is `req.session.passport.user = {}`
  */
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  /* 
    deserializeUser - attaches the loaded user object to the request
                      as `req.user`
  */
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      // only retrieve neccessary data
      const { name, email, _id } = user
      const _user = {
        name,
        email,
        _id
      }
      done(err, _user)
    })
  })
}
