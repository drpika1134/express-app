const express = require('express')
const passport = require('passport')
const router = express.Router()
const ObjectID = require('mongodb').ObjectID
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth')

const User = require('../models/User')

router.get('/edit', [ensureAuthenticated], (req, res) => {
  res.render('edit')
})

// Make a search box instead of passing directly to the url

// router.get('/:name', forwardAuthenticated, (req, res) => {
//   const name = req.params.name
//   User.findOne({ name }, (err, user) => {
//     if (!user) {
//       res.send('No user with that name')
//     } else {
//       const { name, email } = user
//       res.render('profile', { _user: { name, email } })
//     }
//   })
// })

// Edit Handler
router.post('/edit', (req, res) => {
  const { name, email } = req.body
  let _id = ObjectID(req.user._id)

  User.findByIdAndUpdate({ _id }, { $set: { name, email } }, err => {
    if (err) {
      req.flash(
        'error_message',
        'An error has occurred while updating your profile'
      )
      res.redirect('/user/edit')
    } else {
      req.flash('success_message', 'You have successfully edited your profile!')
      res.redirect('/user/edit')
    }
  })
})

module.exports = router
