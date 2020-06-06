const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


//load user model
const User = require('../models/User');

module.exports = function (req, res){
    passport.use(
        new LocalStrategy({usernameField: 'email'}, function (email, password, done){
            //match user
            User.findOne({email: email}).then(user, function (user) {
                if (!user) {
                    return done(null, false, {message: 'Email is not registered'}); 
                }    

                //Match
                bcrypt.compare(password, user.password, (err, isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                        return done(null, user);
                    }
                    else
                    {
                        return done(null, false, {message: 'password incorrect'});
                    }
                });


            });
        }
    ));

    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        user.findById(id, function (err, user){
            done(err, user);
        })
    });

}
