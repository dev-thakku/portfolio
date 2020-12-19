const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const session = require("express-session");
const cors = require("cors");
const morgan = require("morgan");
const nodemailer = require("nodemailer");
require("dotenv").config();

const ShortUrl = require("./models/ShortUrl");
const dbConnect = require("./config/db");

dbConnect();

//INITIALIZING APP
const app = express();

const PORT = process.env.PORT || 3000;
const MODE = process.env.NODE_ENV;

//Logging
if (MODE === "development") {
  app.use(morgan("dev"));
}

//body-parser
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000,
    },
  })
);

//ejs
app.set("view engine", "ejs");

//static folder
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/url", require("./routes/shortner"));

//@desc   PORTFOLIO / landing page
//@route  GET /
app.get("/", (req, res) => {
  res.render("home", { success: req.session.success, err: req.session.err });
});

//@desc   SEND E-MAIL
//@route  POST /form/send
app.post("/form/send", (req, res) => {
  console.log(req.body);
  const output = `
    <h4>FROM: ${req.body.contactName}</h4>
    <h4>Email: ${req.body.contactEmail}</h4>
    <h2>Subject: ${req.body.contactSubject}</h2>
    <p>Message: ${req.body.contactMessage}</p>
  `;

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "thaadi.kglm@gmail.com",
      pass: "shiby@8233",
    },
    tls: { rejectUnauthorized: false },
  });
  var mailOptions = {
    from: `"Nodemailer Contact" <${req.body.contactEmail}>`,
    to: "jemshithtk@gmail.com",
    subject: req.body.contactSubject,
    text: "From contact form of jemshith.tk",
    html: output,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      req.session.success = false;
      req.session.err = true;
      res.redirect("/");
    } else {
      console.log("Email sent: " + info.response);
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      req.session.success = true;
      req.session.err = false;
      res.redirect("/");
    }
  });
});

//@desc   Redirect Route
//@route  GET /:slug
app.get("/:slug", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({
    slug: req.params.slug,
  });
  if (shortUrl == null) return res.redirect("/");

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.fullUrl);
});

app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`);
});
