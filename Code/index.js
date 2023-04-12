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
var Seller = require('./Classes/seller');
var Buyer = require('./Classes/buyer');


// Global
var GLOBAL = {};

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
            con.query(query,  async function (err, result) {
                if (err) throw err;
                
                if (err) throw err;
                if(result[0].type_flag == 0)
                {
                    GLOBAL.user = new Buyer(con, result[0].user_id);
                    // con.query("SELECT * FROM Books", function(err, results) {
                    //     if (err) throw err;
                    // });
                    var books = await GLOBAL.user.viewBooks();
                    res.render('pages/buyer', {name: result[0].username, books: books});
                }
                else if (result[0].type_flag == 1)
                {
                    GLOBAL.user = new Seller.Seller(con, result[0].user_id);
                    var query = mysql.format("SELECT * FROM Inventory WHERE user_id = ?", [result[0].user_id]);
                    con.query(query, function(err, inventory) {
                        // var book = [];
                        // for(var i = 0; i < inventory.length; i++)
                        // {
                        //     console.log("Book");
                        //     var query2 = mysql.format("SELECT * FROM Books WHERE isbn = ?", [inventory[i].isbn]);
                        //     con.query(query2, function(err, results) {
                        //         if (err) throw err;
                        //         book.push(results[0]);
                        //         console.log(book);
                        //     });
                        // };
                        res.render('pages/seller', {title:'Seller Page' , books:book, inventory:inventory});
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

app.post('/viewAllBooks', async function(req, res) {

    var isbn = req.body.isbn;

    var books = await GLOBAL.user.viewListings(isbn);

    res.render('pages/compare', {title: "Compare Page", books: books});
});

app.get('/cart', function(req,res){

    res.render('pages/cart'); // Page you want to render in

});

app.post('/logout', function(req,res) {

    GLOBAL.user = null;

    res.render('pages/login');
})