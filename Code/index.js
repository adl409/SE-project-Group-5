var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var Login = require('./Function_requirements/login');
var createAccount = require('./Function_requirements/create_account');
var UnSetAdmin = require('./Function_requirements/unSetAdmin');
var SetAdmin = require('./Function_requirements/setAdmin');

// Classes
var Seller = require("./Classes/seller");

var con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"SELab"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database");
});

var app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.listen(8080);
app.use(bodyParser.urlencoded({extended:true}));
// app.use(session({secret:"secret"}));

// localhost:8080
app.get('/', function(req,res){

    res.render('pages/login'); // Page you want to render in

});

app.get('/create_account', function(req,res){

    res.render('pages/create_account'); // Page you want to render in

});

app.post('/login_init', async function(req,res) {

    try
    {
        var username = req.body.username;
        var password = req.body.password;

        const result = await Login.Login(username, password);
        if (result) {
            console.log("User authenticated");
            var query = mysql.format("SELECT * FROM users WHERE username = ?", [username]);
            con.query(query, function (err, result) {
                if (err) throw err;
                
                if (err) throw err;
                if(result[0].type_flag == 0)
                {
                    con.query("SELECT * FROM Books", function(err, results) {
                        if (err) throw err;
                        res.render('pages/buyer', {name: result[0].username, books: results});
                    });
                }
                else if (result[0].type_flag == 1)
                {
                    con.query("SELECT * FROM Books", function(err, results) { // Needs who's selling the books
                        if (err) throw err;
                        res.render('pages/seller', {name: result[0].username, books:results});
                    });
                }
                else if (result[0].type_flag == 2)
                {
                    con.query("SELECT * FROM Users", function(err, results) {
                        if (err) throw err;
                        res.render('pages/admin', {title:'Admin Page', owner: 0, action:'list', users: results, user: result});
                    });
                }
                else if (result[0].type_flag == 3)
                {
                    con.query("SELECT * FROM Users", function(err, results) {
                        if (err) throw err;
                        res.render('pages/admin', {title:'Owner Page', owner: 1, action:'list', users: results, user: result});
                    });
                }
            });
        } else {
            console.log("Authentication failed");
        }
    }
    catch (err) 
    {
        console.log("Error:", err);
    }
});

app.post('/create_account_init', async function(req,res) {

    try
    {
        var username = req.body.username;
        var password = req.body.password;

        createAccount.createAccount(username, password);
    }
    catch (err) 
    {
        console.log("Error:", err);
    }
});

app.post('/changeUser', async function(req, res) {

    try{
        const admin = req.body.admin;
        const username = req.body.username;
        const user_id = req.body.id;

        let result;
        if (admin)
        {
            result = await SetAdmin.SetAdmin(user_id);
            if(result){
                console.log(username + " is now Admin");
            }
            else{
                console.log("User cannot be admin");
            }
        }
        else
        {
            result = await UnSetAdmin.UnSetAdmin(user_id);
            if(result)
            {
                console.log(username + " is no longer an admin");
            }
            else{
                console.log("Cannot unset user");
            }
        }
    }
    catch (err)
    {
        console.log("Error: ", err);
    }
});

app.get('/cart', function(req,res){

    res.render('pages/cart'); // Page you want to render in

});