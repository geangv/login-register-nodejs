const LocalStrategy=require('passport-local').Strategy;
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

//LOAD USER MODEL;
const User=require('../models/User')

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password ,done) =>{
            //MATCH USER;
            User.findOne({email:email})
            .then(user => {
                if(!user){
                    return done(null,false, {message:'That email is not registered'})
                }
                //MATCH PASSWORD;
                bcrypt.compare(password, user.password, (err,isMatch) =>{
                    if(err) throw err;

                    if(isMatch){
                        return done(null,user)
                    } else {
                        return done(null,false,{message:'Password Incorrect'})
                    }
                })
            })
                .catch(err => console.log(err))
        })
    )
    
    passport.serializeUser((user,done) => {
        done(null,user.id);
    });

    passport.deserializeUser((id,done) => {
        User.findById(id, (err,user) => {
            done(err,user);
        });
    })
}