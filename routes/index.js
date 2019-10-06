const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')

router.get('/', (req, res) => {
  res.render('welcome')
})

// dashboard can only be accessed by authenticated user
router.get('/dashboard', [ensureAuthenticated, preventCache], (req, res) => {
  res.render('dashboard', { name: req.user.name })
})

// This solves the back button issue
function preventCache(req, res, next) {
  res.set(
    'Cache-Control',
    'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
  )
  next()
}

module.exports = router
