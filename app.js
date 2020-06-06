const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
//require('./config/passport')(passport);




//db config
mongoose.connect('mongodb://localhost:27017/RegistrationSystem');

//connection under model folder

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//bodyParser
app.use(express.urlencoded(
   { extended: false }
));

//express session
app.use(session({ 
         secret: 'secret',
         resave: true,
         saveUninitialized: true
      }));

//require('./config/passport')(passport);
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

   
//connect flash
app.use(flash());



//css
app.use('/assets',express.static('assets'));

//GLOBAL variables
app.use(function (req, res, next){
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   next();
});




//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));








app.listen(PORT);
console.log(`Listening on port ${PORT}`);