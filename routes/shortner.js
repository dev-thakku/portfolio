const router = require('express').Router();
const ShortUrl = require('../models/ShortUrl');

//middleware
//@desc To Protect the Shortner Route
let ensureAdmin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/url/login')
  }
}

//@desc   Login to URL Shortner
//@route  GET /url/login
router.get('/login', (req, res) => {
  res.render('login')
})

//@desc   URL Shortner Landing Page
//@route  GET /url
router.get('/', ensureAdmin, async (req, res) => {
  const shortUrls = await ShortUrl.find()
  console.log(shortUrls)
  res.render('app', {
    shortUrls
  })
})

//@desc   Login Verify
//@route  POST /url/login
router.post('/login', (req, res) => {
  const {
    user, password
  } = req.body
  const USER = process.env.USER;
  const PASS = process.env.PASS;
  if (user === USER && password === PASS) {
    console.log('logged in')
    req.session.loggedIn = true
    res.redirect('/url')
  } else {
    console.log('failed')
    req.session.loggedIn = false
    res.redirect('/url/login')
  }
})

//@desc   Create Short URL
//@route  POST /url/create
router.post('/create', ensureAdmin, async (req, res) => {
  const {
    url,
    slug
  } = req.body;
  await ShortUrl.create({
    fullUrl: url,
    slug,
  })
  res.redirect('/url')
})

module.exports = router;