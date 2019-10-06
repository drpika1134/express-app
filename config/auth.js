module.exports = {
  ensureAuthenticated: function(req, res, next) {
    /* 
      isAuthenticated() is similar to check if the `req.session.passport.user !== undefined` or == undefined
    */
    if (req.isAuthenticated()) {
      // if (req.session.passport.user !== undefined) meaning that the user has a session going on
      return next()
    }
    res.redirect('/users/login')
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next()
    }

    res.redirect('/dashboard')
  }
}
