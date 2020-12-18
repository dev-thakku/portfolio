const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const session = require('express-session');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const ShortUrl = require('./models/ShortUrl');
const dbConnect = require('./config/db');

dbConnect();

//INITIALIZING APP
const app = express();

const PORT = 3000 || process.env.PORT;
const MODE = process.env.NODE_ENV;

//Logging
if (MODE === 'development') {
  app.use(morgan('dev'));
}

//body-parser
app.use(bodyParser.urlencoded({
  extended: true
}));

//session
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60000
  }
}))

//ejs
app.set('view engine', 'ejs');

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/url', require('./routes/shortner'));

//@desc   PORTFOLIO / landing page
//@route  GET /
app.get('/', (req, res) => {
  res.render('home');
})

//@desc   Redirect Route
//@route  GET /:slug
app.get('/:slug', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({
    slug: req.params.slug
  });
  if (shortUrl == null) return res.redirect('/')

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.fullUrl)
})

app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`)
})