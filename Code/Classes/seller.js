var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "SELab"
});

con.promise = (sql, params) => {
    return new Promise((resolve, reject) => {
      
        con.query(sql,params, (err, result) => {
        
        if(err){reject(new Error());}
        
        else{resolve(result);}
        
    });
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
        // FIXME
        let query = mysql.format(`INSERT INTO Inventory SET 
        quantity = ?,
        user_id = ?,
        price = ?,
        isbn = ?`,
        [quantity, this.userID, price, isbn]);

        con.query(query, function (err, result) {
            if (err) throw err;
            console.log("Listing Created");
            });
    }

    async updatePricing(isbn, price){
        let query = mysql.format(`UPDATE Inventory SET price = ? WHERE 
        user_id = ? AND
        isbn = ?`,
        [price, this.userID, isbn]);
        con.query(query, function (err, result) {
            if (err) throw err;
            console.log("Pricing Updated");
        });
    }

    async updateQuantity(isbn, quantity){
        let query = mysql.format(`UPDATE Inventory SET quantity = ? WHERE 
        user_id = ? AND
        isbn = ?`,
        [quantity, this.userID, isbn]);
        con.query(query, function (err, result) {
            if (err) throw err;
            console.log("Quantity Updated");
        });
    }

    // remove from cart
    async removeListing(isbn){
        // FIXME
        
        let query = mysql.format(`DELETE FROM Inventory WHERE 
        isbn = ? AND user_id = ?`,
        [isbn, this.userID]);

        con.query(query, function (err, result) {
            if (err) throw err;
            console.log("Listing Removed");
            });
    }

    async bookInfoFromListing(itemID){
        let query = mysql.format(`SELECT isbn FROM Inventory WHERE item_id = ?`,
            [itemID]);
        let isbn = await con.promise(query);
        isbn = isbn[0].isbn;


        query = mysql.format(`SELECT * FROM Books WHERE isbn  = ?`,
            [isbn]);
        let bookInfo = await con.promise(query);
    
        return bookInfo[0];
    }

    // view listings
    async getListings(){
        var query = mysql.format("SELECT * FROM Inventory INNER JOIN Books ON Inventory.isbn = Books.isbn WHERE Inventory.user_id = ?", [this.userID]);
        return await con.promise(query);
    }
    
    async getTransactions()
    {
        var query = mysql.format(`SELECT Inventory.isbn, Books.title, Books.category, Books.author, Cart_Items.static_price, Cart_Items.quantity 
        FROM Cart_Items 
        INNER JOIN Inventory ON Inventory.item_id = Cart_Items.item_id
        INNER JOIN Carts ON Cart_Items.cart_id = Carts.cart_id
        INNER JOIN Books ON Books.isbn = Inventory.isbn
        WHERE Carts.purchased_flag = 1 AND Inventory.user_id = ?`, [this.userID]);
        return await con.promise(query);
    }

    async bookExists(isbn)
    {
        return new Promise((resolve, reject) => {
            var query = mysql.format(`SELECT * FROM Inventory WHERE user_id = ? AND isbn = ?`, [this.userID, isbn]);
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
        });
    }

}    

module.exports = Seller;