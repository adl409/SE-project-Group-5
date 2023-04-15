var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var Login = require('./Function_requirements/login');
var createAccount = require('./Function_requirements/create_account');
var nocache = require('nocache');
// Classes
var Seller = require('./Classes/seller');
var Buyer = require('./Classes/buyer');
var Admin = require('./Classes/admin');
var Owner = require('./Classes/owner');

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
app.use(nocache());

app.set('view engine', 'ejs');

app.listen(8080);
app.use(bodyParser.urlencoded({extended:true}));
// app.use(session({secret:"secret"}));

// localhost:8080
app.get('/', function(req,res){

    res.render('pages/login', {message: null, warning: null}); // Page you want to render in

});

app.get('/login', function(req,res) {

    res.render('pages/login', {message: null, warning: null})

});

app.get('/create_account', function(req,res){

    res.render('pages/create_account', {warning: null}); // Page you want to render in

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

                    var books = await GLOBAL.user.viewBooks();
                    res.render('pages/buyer', {popup: null, message: null, name: result[0].username, books: books});
                }
                else if (result[0].type_flag == 1)
                {
                    GLOBAL.user = new Seller(con, result[0].user_id);

                    var results = await GLOBAL.user.getListings();
                    res.render('pages/seller', {message: null, title:'Seller Page' , books: results});
                }
                else if (result[0].type_flag == 2)
                {
                    GLOBAL.user = new Admin(con, result[0].user_id);
                    con.query("SELECT * FROM Users", function(err, results) {
                        if (err) throw err;
                        res.render('pages/admin', {message: null, title:'Admin Page', owner: 0, users: results});
                    });
                }
                else if (result[0].type_flag == 3)
                {
                    GLOBAL.user = new Owner(con, result[0].user_id);
                    con.query("SELECT * FROM Users", function(err, results) {
                        if (err) throw err;
                        res.render('pages/admin', {message: null, title:'Owner Page', owner: 1, users: results});
                    });
                }
            });
        } else {
            console.log("Authentication failed");
            res.render('pages/login', {warning: "Invalid credentials", message: null});
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
        var email = req.body.email;

        var results = await createAccount.createAccount(username, password, email);

        var query = mysql.format(`SELECT * FROM users WHERE username = ? AND password = ?`,[username, password])
        con.query(query, function(err,result)
        {
            if(err) throw(err);
            GLOBAL.user = new Buyer(con, result[0].user_id);
            GLOBAL.user.createCart();
        })

        if(results)
        {
            res.render('pages/login', {message: "Account created successfully", warning: null});
        }
        else
        {
            res.render('pages/create_account', {warning: "Username already exists!"});
        }

    }
    catch (err) 
    {
        console.log("Error:", err);
    }
});

app.post('/changeUser', async function(req, res) {

    try{
        const seller = req.body.seller;
        const username = req.body.username;
        const user_id = parseInt(req.body.id);
        const block = req.body.block;
        const owner = parseInt(req.body.owner);

        let result;

        if(owner)
        {
            const admin = req.body.admin;

            if(admin)
            {
                result = await GLOBAL.user.SetAdmin(user_id);
                if(result){
                    console.log(username + " is now Admin");
                }
                else{
                    console.log("User cannot be admin");
                }
            }
            else if(seller)
            {
                result = await GLOBAL.user.SetSeller(user_id);
                if(result){
                    console.log(username + " is now seller");
                }
                else{
                    console.log("User cannot be seller");
                }
            }
            else
            {
                result = await GLOBAL.user.SetBuyer(user_id);
                if(result)
                {
                    console.log(username + " is now buyer");
                }
                else{
                    console.log("Cannot unset user");
                }
            }
        }
        else
        {
            if(seller)
            {
                result = await GLOBAL.user.SetSeller(user_id);
                if(result){
                    console.log(username + " is now seller");
                }
                else{
                    console.log("User cannot be seller");
                }
            }
            else
            {
                result = await GLOBAL.user.SetBuyer(user_id);
                if(result)
                {
                    console.log(username + " is now buyer");
                }
                else{
                    console.log("Cannot unset user");
                }
            }
        }

        if (block)
        {
            result = await GLOBAL.user.BlockedUser(user_id);
            if(result){
                console.log(username + " is now blocked");
            }
            else{
                console.log("User cannot be blocked");
            }
        }
        else
        {
            result = await GLOBAL.user.unblock(user_id);
            if(result)
            {
                console.log(username + " is no longer blocked");
            }
            else{
                console.log("Cannot unblock user");
            }
        }

        con.query("SELECT * FROM Users", function(err, results) {
            if (err) throw err;
            if(owner)
            {
                res.render('pages/admin', {message: "Saved successfully", title:'Owner Page', owner: 1, users: results});
            }
            else
            {
                res.render('pages/admin', {message: "Saved successfully", title:'Admin Page', owner: 0, users: results});
            }
        });
        
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

app.get('/cart', async function(req,res){

    var books = await GLOBAL.user.viewCart();

    res.render('pages/cart', {books: books}); // Page you want to render in

});

app.post('/logout', function(req,res) {

    GLOBAL.user = null;

    res.render('pages/login', {message: "Log out successfully!", warning: null});
});

app.post('/addToCart', async function(req, res) {

    var quantity = req.body.quantity;
    var item_id = req.body.item_id;
    var price = parseInt(req.body.price);

    await GLOBAL.user.addItemToCart(item_id, quantity, price);

    var books = await GLOBAL.user.viewBooks();
    var name =  await GLOBAL.user.getUsername();
    res.render('pages/buyer', {popup: null, message: "Added item to Cart", name: name, books: books});

});

app.post('/deleteFromCart', async function(req, res) {

    var item_id = req.body.cart_item_id;

    GLOBAL.user.removeItemFromCart(item_id);

    var books = await GLOBAL.user.viewBooks();
    var name =  await GLOBAL.user.getUsername();
    res.render('pages/buyer', {popup: null, message: "Deleted item from Cart", name: name, books: books});

});

app.get('/buyer', async function(req, res) {

    var books = await GLOBAL.user.viewBooks();
    var name =  await GLOBAL.user.getUsername();
    res.render('pages/buyer', {popup: null, message: null, name: name, books: books});

});

app.post('/checkout', async function(req, res) {

    var rejects = await GLOBAL.user.checkout();

    var books = await GLOBAL.user.viewBooks();
    var name =  await GLOBAL.user.getUsername();

    if(!rejects.length)
    {
        res.render('pages/buyer', {popup: null, message: "Checkout successful", name: name, books: books});
    }
    else
    {
        res.render('pages/buyer', {popup: "There are " + rejects.length + " book(s) that are out of stock. These books are removed from your cart. The others are checked out.", 
        message: "Checkout successful", name: name, books: books, rejects: rejects});
    }

});

app.post('/createListing', async function(req,res){
    
    res.render('pages/add_listing', {warning: null});
});

app.post('/updateListing', async function(req,res){

    var action = req.body.action;
    var isbn = req.body.isbn;

    if(action == "delete")
    {
        await GLOBAL.user.removeListing(isbn);
    }
    else if (action == "update")
    {
        var amount = parseInt(req.body.amount);
        await GLOBAL.user.updatePricing(isbn, amount);
    }
    else if (action == "add")
    {
        var amount = parseInt(req.body.amount);
        var quantity = parseInt(req.body.quantity);

        var num = amount + quantity;

        await GLOBAL.user.updateQuantity(isbn, num);
    }
    
    var result = await GLOBAL.user.getListings();
    res.render('pages/seller', {message: "Updated Successfully", title:'Seller Page' , books: result});

});

app.get('/seller', async function(req,res) {

    var result = await GLOBAL.user.getListings();
    res.render('pages/seller', {message: null, title:'Seller Page' , books: result});
});

app.post('/createBook', async function(req, res) {

    
    var isbn = parseInt(req.body.isbn);
    var price = parseInt(req.body.price);

    if(isbn)
    {

        var flag = await GLOBAL.user.bookExists(isbn);

        if(flag)
        {
            await GLOBAL.user.createListing(isbn, 0, price);

            var result = await GLOBAL.user.getListings();
            res.render('pages/seller', {message: "Book successfully added", title:'Seller Page' , books: result});
        }
        else
        {
            res.render('pages/add_listing', {warning: "You are already selling this book"});
        }
        
    }
    else
    {
        res.render('pages/add_listing', {warning: "Please select a book"});
    }

});

app.post('/linkSeller', async function(req, res) {

    var userId = parseInt(req.body.userId);
    GLOBAL.user = new Seller(con, userId);

    var result = await GLOBAL.user.getListings();
    res.render('pages/seller', {message: null, title:'Seller Page' , books: result});

});

app.get('/transactions', async function(req, res) {

    var results = await GLOBAL.user.getTransactions();

    res.render('pages/transaction', {title: "Transactions", results: results});
});