const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt');
const passport=require('passport');

const User= require('../models/User');

//LOGIN PAGE;
router.get('/login', (req,res) => res.render('login'));

//REGISTER PAGE;
router.get('/register', (req,res) => res.render('register'));

//REGISTER HANDLE POST;
router.post('/register', (req,res) => {
    const {name,email,password,password2}=req.body;
    let errors=[];

    //CHECK REQUIRED FIELDS;
    if(!name || !email || !password || !password2){
        errors.push({msg:'Please fill in all fields'});
    }

    //CHECK PASSWORD MATCHES;
    if(password !== password2){
        errors.push({msg:'Passwords is not match'});
    }

    //CHECK LENGTH PASSWORD;
    if(password.length < 6){
        errors.push({msg:'Password should be at least 6 characters'});
    }

    //CHECK ERRORS;
    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        User.findOne({email:email})
        .then(user => {
            if(user){
                errors.push({msg:'Email already exits'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                })

                //HASH PASSWORD;
                bcrypt.genSalt(10, (err,salt) => {
                    bcrypt.hash(newUser.password, salt, (err,hash) => {
                        if(err) throw err;
                        //SET PASSWORD TO HASHED
                        newUser.password=hash;
                        //SAVE USER;
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are now registered and can log in')
                            res.redirect('/users/login')
                        })
                        .catch(err => console.log(err))
                    })
                })
            }
        })
    }
});

//LOGIN HANDLE;
router.post('/login', (req,res,next) =>{
    passport.authenticate('local', {
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next)
})

//HANDLE LOGGOUT;
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login')
});

module.exports=router;



