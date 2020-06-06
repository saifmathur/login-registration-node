const express = require('express');
const app = express();
const router = express.Router();
const bcrypt = require('bcryptjs'); //encrypting password
//User model
const User = require('../models/Users');
const passport = require('passport');


app.use(express.static(__dirname + '/assets'));

//login page
router.get('/login',function (req, res){
    res.render('login');
});

//register page
router.get('/register', function (req, res){
    res.render('register');
});

//register handle
router.post('/register', function (req, res){
    //console.log(req.body);
    //res.send('hello');
    const { name,                      //pulling these variables out
            email,
            password,
            password2  } = req.body;

    let errors = [];
    //check required variables
    if(!name || !email || !password || !password2){
        errors.push({msg: 'Please fill in all fields'});
    }

    //check passwords match
    if(!password || !password2){
        errors.push({msg: 'Passwords do not match'});
    }

    //check pass lenght

    if(password.length < 6){
        errors.push({msg: 'Password should be at least 6 characters'});
    }

    if(errors.length > 0) //some problem 
    {
        res.render('register',  {
            errors,
            name,
            email,
            password,
            password2    
        });
    }
    else
    {
        //res.send('pass');
        //validation passed
        User.findOne(
                { email : email }
            ).then(function (user){
                if (user) {
                    //user exists
                    errors.push({ msg: 'A user is already registered with this email address' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2   
                        });
                }
                else{
                    const newUser = new User({
                            name,
                            email,
                            password 
                        });

                    bcrypt.genSalt(10, function (err, salt){
                        bcrypt.hash(newUser.password, salt, function (err,hash){
                            if(err) throw err;
                            
                            newUser.password = hash;
                            //save the user to the database
                            newUser.save().then(function (user){
                                req.flash('success_msg', 'You are now registered!');
                                res.redirect('/users/login');
                            }).catch(function (error){console.log(error)});
                        });
                    });
                    
                   // console.log(newUser);
                    //res.send('Hello');
                }
            });

    }

});

//login handle
router.post('/login', function (req, res, next){
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

module.exports = router;