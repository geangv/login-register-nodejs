const express=require('express');
const bodyParser=require('body-parser');
const expressLayouts=require('express-ejs-layouts');
const path=require('path');
const mongoose=require('mongoose');
const flash=require('connect-flash');
const session=require('express-session')
const passport=require('passport');

const app=express();

//DB CONFIG;
const db=require('./config/keys').MongoURI;

//PASSPORT CONFIG;
require('./config/passport')(passport);

//CONNECT MONGODB;
mongoose.connect(db, {useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true})
.then(() => console.log('MongoDB connect success...'))
.catch(err => console.log(err));

//BODYPARSER;
app.use(express.urlencoded({extended:false}));


//EXPRESSION SESSION;
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));

//CONNECT FLASH;
app.use(flash());

//PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

//GLOBAL VARS;
app.use((req,res,next) => {
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
})

//EJS CONFIG;
//app.use(express.static(__dirname + './views'));
//app.set('views', __dirname + '/views')
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT = process.env.PORT || 3030;

app.listen(PORT, console.log(`Server rodando na porta ${PORT} do localhost!`))