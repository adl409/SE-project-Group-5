var mysql = require('mysql');

var con = mysql.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:"root",
    database:"SELab"
});

con.connect();

async function promise(sql, params) {
    return new Promise((resolve, reject) => {

        var con = mysql.createConnection({
            host:"127.0.0.1",
            user:"root",
            password:"root",
            database:"SELab"
        });

        con.connect();

        con.query(sql,params, (err, result) => {
        
            if(err) reject(err);
            
            else{resolve(result);}
            
        });

        con.end();

    });
};

module.exports = con;

// async function login(con, username, password){
//     let query = mysql.format(`SELECT * FROM SELab.users WHERE username = ? AND password = ?`, [username, password]);
//     results = await promise(query, username, password);

//     return results[0].user_id;
// }

const Buyer = class{

    constructor(connection, userid){
        this.con = connection;
        this.userID = userid;
        // queries for userid matching username
        // need to add input filtering for unique usernames
    }

    get getUserID() {
        return this.userID;
    }

    async getUsername(){

        let query = mysql.format('SELECT * FROM SELab.users WHERE user_id = ?', [this.userID]);
        let results = await promise(query, this.userID);

        return results[0].username;
    }

    async getCartID(){

        let query = mysql.format(`SELECT * FROM SELab.carts WHERE user_id = ? AND purchased_flag = 0`, [this.userID]);
        let results = await promise(query, this.userID);
        if(results.length == 0){
            this.createCart();
            let query = mysql.format(`SELECT * FROM SELab.carts WHERE user_id = ? AND purchased_flag = 0`, [this.userID]);
            results = await promise(query, this.userID);
        }
        return results[0].cart_id;
    }

    // create cart
    createCart(){
        return new Promise((resolve, reject) => {
            var con = mysql.createConnection({
                host:"127.0.0.1",
                user:"root",
                password:"root",
                database:"SELab"
            });

            con.connect();

            let query = mysql.format(`INSERT INTO SELab.carts SET
            user_id = ?,
            purchased_flag = ?`,
            [this.userID, '0']);
            con.query(query, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                resolve(true);
            });

            con.end();
        });
    }
    

    // add to cart
    // need to check for stocks

    async addItemToCart(itemID, quantity, price){
        return new Promise(async (resolve, reject) => {
            var con = mysql.createConnection({
                host:"127.0.0.1",
                user:"root",
                password:"root",
                database:"SELab"
            });

            con.connect();
            
            let cartID = await this.getCartID();
            let query = mysql.format(`INSERT INTO SELab.cart_items SET 
            quantity = ?,
            cart_id = ?,
            item_id = ?,
            static_price = ?`,
            [quantity, cartID, itemID, price]);

            con.query(query, function (err, result) {
                if (err) reject(err);
                console.log("Item added to cart");
                resolve(true);
            });

            con.end();
        });

    }

    // remove from cart
    async removeItemFromCart(itemID){
        return new Promise(async (resolve, reject) => {
            var con = mysql.createConnection({
                host:"127.0.0.1",
                user:"root",
                password:"root",
                database:"SELab"
            });

            con.connect();

            let cartID = await this.getCartID();
            
            let query = mysql.format(`DELETE FROM SELab.cart_items WHERE 
            cart_item_id = ? AND cart_id = ?`,
            [itemID, cartID]);

            con.query(query, function (err, result) {
                if (err) reject(err);
                console.log("Item removed from cart");
                resolve(true);
            });

            con.end();
        });

    }

    async checkout(){

        var con = mysql.createConnection({
            host:"127.0.0.1",
            user:"root",
            password:"root",
            database:"SELab"
        });

        con.connect();

        let rejects = [];

        let cartID = await this.getCartID();
        
        // check for stock
        
        let query = mysql.format(`SELECT quantity, item_id FROM SELab.cart_items WHERE cart_id = ?`,
            [cartID]);
        let items = await promise(query);
        
        // update quantities
        for(let i = 0; i < items.length; i++){
            let query = mysql.format(`SELECT isbn, quantity FROM SELab.inventory WHERE item_id = ?`,
            [items[i].item_id]);
            let temp = await promise(query);

            console.log(items[i].quantity);
            console.log(temp[0].quantity);

            if(items[i].quantity >  temp[0].quantity){
                rejects.push(inventory[i].isbn)
                this.removeItemFromCart(items[i].item_id);
            }
            else
            {

                let query = mysql.format(`UPDATE SELab.inventory SET Quantity = ? WHERE 
                item_id = ?`,
                [temp[0].quantity-items[i].quantity, items[i].item_id]);
                con.query(query, function(err, result) {
                    if(err) throw err;
                })

            }
        }   

        // set purchased flag
        query = mysql.format(`UPDATE SELab.carts SET purchased_flag = 1 WHERE 
        cart_id = ?`,
        [cartID]);
        con.query(query, function (err, result) {
            if (err) throw err;
            console.log("Cart Purchased");
        });
        
        // create new cart
        this.createCart();

        con.end();

        return rejects;
    }


    // helper function to obtain data about books
    async bookInfoFromListing(itemID){

        var con = mysql.createConnection({
            host:"127.0.0.1",
            user:"root",
            password:"root",
            database:"SELab"
        });

        con.connect();

        let query = mysql.format(`SELECT isbn FROM SELab.inventory WHERE item_id = ?`,
            [itemID]);
        let isbn = await promise(query);
        isbn = isbn[0].isbn;


        query = mysql.format(`SELECT * FROM SELab.books WHERE isbn  = ?`,
            [isbn]);
        let bookInfo = await promise(query);
    
        con.end();

        return bookInfo[0];
    }

    // view items
    // outputs list of listings where listings are in format [ISBN, Title, Category, Author, Quantity, Price, Seller Username]
    async viewListings(isbn){

        var con = mysql.createConnection({
            host:"127.0.0.1",
            user:"root",
            password:"root",
            database:"SELab"
        });

        con.connect();

        let query = mysql.format(`SELECT * FROM SELab.inventory WHERE isbn = ?`, [isbn]);
        let rawListings = await promise(query);
        let listings = [];
        let book = "";
        for(let i = 0; i < rawListings.length; i++){
            let query = mysql.format(`SELECT username FROM SELab.users WHERE user_id = ?`,
            [rawListings[i].user_id]);
            let seller = await promise(query);
            book = await this.bookInfoFromListing(rawListings[i].item_id);
            listings.push([book.title, seller[0].username, rawListings[i].quantity, rawListings[i].price, rawListings[i].item_id]);
            // listings.push([book.isbn, book.title, book.category, book.author, rawListings[i].quantity, rawListings[i].price, seller[0].username]);
        }

        con.end();

        return listings;
    }

    async viewBooks(){

        var query = mysql.format("SELECT * FROM SELab.books");
        var books = await promise(query);

        return books;
    }

    async viewCart(){

        let cartID = await this.getCartID();
        
        let query = mysql.format(`SELECT item_id, quantity, cart_item_id FROM SELab.cart_items WHERE cart_id = ?`,
            [cartID]);
        let items = await promise(query);

        let books = [];
        let book = [];
        let price = [];

        for(let i = 0; i < items.length; i++){
            query = mysql.format(`SELECT price FROM SELab.inventory WHERE item_id = ?`,
            [items[i].item_id]);
            price = await promise(query);
            book = await this.bookInfoFromListing(items[i].item_id)
            books.push([book.isbn, book.title, book.category, book.author, price[0].price, items[i].quantity, items[i].cart_item_id]);
        }

        return books;
    }

};

con.end();

module.exports = Buyer;