const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const handlebars = require('express-handlebars');


const UserApiRouter = require('./modules/api/users/router');

const AuthApiRouter = require('./modules/api/auth/router');

const userApiRecord = require('./modules/api/users/userRecord');

mongoose.connect("mongodb://localhost/entry-test", (err)=>{
    if(err) console.log(err)
    else console.log("DB connect success! ");
})

let app = express();

app.engine("handlebars", handlebars({defaultLayout:'main'}));
app.set('view engine','handlebars');

app.use(session({
    secret: 'oggy',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        // khi chay o local thi secure phai dat la false, khi chay o server thi phai dat secure la true 
        secure :true,
        maxAge: 6* 60 * 60 * 100
        // cookie chi ton tai trong 24 tieng 
     }
  }));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/users', UserApiRouter);
app.use('/api/auth', AuthApiRouter);
app.use('/api/users',userApiRecord);


const PORT = 5100;

app.get("/", function(req,res) {
    res.render('pascal');
})

app.get("/login", function(req,res) {
    res.render('login');
})

app.listen(PORT,(err) => {
    if(err) console.log(err)
    else console.log("Server is listening")
})