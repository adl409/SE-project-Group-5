var mysql = require('mysql');

var con = mysql.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:"root",
    database:"SELab"
});

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


const Seller = class{

    constructor(connection, userid){
        this.con = connection;
        this.userID = userid;
        // queries for userid matching username
        // need to add input filtering for unique usernames
    }

    get getUserID() {
        return this.userID;
    }
    

    // create listing

    async createListing(isbn, quantity, price){

        return new Promise((resolve, reject) => {

            var con = mysql.createConnection({
                host:"127.0.0.1",
                user:"root",
                password:"root",
                database:"SELab"
            });

            con.connect();

            // FIXME
            let query = mysql.format(`INSERT INTO inventory SET 
            quantity = ?,
            user_id = ?,
            price = ?,
            isbn = ?`,
            [quantity, this.userID, price, isbn]);

            con.query(query, function (err, result) {
                if (err) reject(err);
                console.log("Listing Created");
                resolve(true);
                });

            con.end();
        });
            
    }

    async updatePricing(isbn, price){

        var con = mysql.createConnection({
            host:"127.0.0.1",
            user:"root",
            password:"root",
            database:"SELab"
        });

        con.connect();

        let query = mysql.format(`UPDATE inventory SET price = ? WHERE 
        user_id = ? AND
        isbn = ?`,
        [price, this.userID, isbn]);
        con.query(query, function (err, result) {
            if (err) throw err;
            console.log("Pricing Updated");
        });

        con.end();

    }

    async updateQuantity(isbn, quantity){

        var con = mysql.createConnection({
            host:"127.0.0.1",
            user:"root",
            password:"root",
            database:"SELab"
        });

        con.connect();

        let query = mysql.format(`UPDATE inventory SET quantity = ? WHERE 
        user_id = ? AND
        isbn = ?`,
        [quantity, this.userID, isbn]);
        con.query(query, function (err, result) {
            if (err) throw err;
            console.log("Quantity Updated");
        });

        con.end();

    }

    // remove from cart
    async removeListing(isbn){

        var con = mysql.createConnection({
            host:"127.0.0.1",
            user:"root",
            password:"root",
            database:"SELab"
        });

        con.connect();

        // FIXME
        
        let query = mysql.format(`DELETE FROM SELab.inventory WHERE 
        isbn = ? AND user_id = ?`,
        [isbn, this.userID]);

        con.query(query, function (err, result) {
            if (err) throw err;
            console.log("Listing Removed");
            });

        con.end();
        
    }

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

    // view listings
    async getListings(){

        var con = mysql.createConnection({
            host:"127.0.0.1",
            user:"root",
            password:"root",
            database:"SELab"
        });

        con.connect();

        var query = mysql.format("SELECT * FROM SELab.inventory INNER JOIN Books ON inventory.isbn = Books.isbn WHERE inventory.user_id = ?", [this.userID]);
        
        con.end();
        
        return await promise(query);
    }
    
    async getTransactions()
    {
        var query = mysql.format(`SELECT inventory.isbn, books.title, books.category, books.author, cart_items.static_price, cart_items.quantity 
        FROM SELab.cart_items 
        INNER JOIN inventory ON inventory.item_id = cart_items.item_id
        INNER JOIN carts ON cart_items.cart_id = carts.cart_id
        INNER JOIN books ON books.isbn = inventory.isbn
        WHERE carts.purchased_flag = 1 AND inventory.user_id = ?`, [this.userID]);

        con.end();

        return await promise(query);
    }

    async bookExists(isbn)
    {
        return new Promise((resolve, reject) => {

            var con = mysql.createConnection({
                host:"127.0.0.1",
                user:"root",
                password:"root",
                database:"SELab"
            });

            con.connect();

            var query = mysql.format(`SELECT * FROM SELab.inventory WHERE user_id = ? AND isbn = ?`, [this.userID, isbn]);
            con.query(query, function(err, result) {
                if(err) reject(err);
                if(!result.length)
                {
                    resolve(true);
                }
                else
                {
                    resolve(false);
                }
            })

            con.end();

        });
    }

}    

con.end();

module.exports = Seller;