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

// async function login(con, username, password){
//     let query = mysql.format(`SELECT * FROM Users WHERE username = ? AND password = ?`, [username, password]);
//     results = await con.promise(query, username, password);

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

    async getCartID(){
        let query = mysql.format(`SELECT * FROM Carts WHERE user_id = ? AND purchased_flag = 0`, [this.userID]);
        results = await con.promise(query, this.userID);
        if(results.length == 0){
            this.createCart();
            let query = mysql.format(`SELECT * FROM Carts WHERE user_id = ? AND purchased_flag = 0`, [this.userID]);
            results = await con.promise(query, this.userID);
        }
        return results[0].cart_id;
    }

    // create cart
    createCart(){
        let query = mysql.format(`INSERT INTO Carts SET
            user_id = ?,
            purchased_flag = ?`,
            [this.userID, '0']);
        this.con.query(query, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        });
    }
    

    // add to cart
    // need to check for stocks

    async addItemToCart(itemID, quantity){
        let cartID = await this.getCartID();
        let query = mysql.format(`INSERT INTO Cart_Items SET 
        quantity = ?,
        cart_id = ?,
        item_id = ?`,
        [quantity, cartID, itemID]);

        con.query(query, function (err, result) {
            if (err) throw err;
            console.log("Item added to cart");
            });
    }

    // remove from cart
    async removeItemFromCart(itemID){
        let cartID = await this.getCartID();
        
        let query = mysql.format(`DELETE FROM Cart_Items WHERE 
        cart_item_id = ? AND cart_id = ?`,
        [itemID, cartID]);

        con.query(query, function (err, result) {
            if (err) throw err;
            console.log("Item removed from cart");
            });
    }

    /*
    // checkout
    async checkout(){
        let cartID = await this.getCartID();
        
        // check for stock
        
        let query = mysql.format(`SELECT quantity, item_id FROM Cart_Items WHERE cart_id = ?`,
            [cartID]);
        let items = await con.promise(query);
        
        // update quantities

        for(let i = 0; i < items.length; i++){
            if(items[i].quantity > INVENTORY QUANT){
                this.removeItemFromCart(items[i].item_id);
            }
            else{
                // UPDATE INVENTORY QUANT
            }
        }

        // set purchased flag
        let query = mysql.format(`UPDATE Cart SET purchased_flag = 1 WHERE 
        cart_id = ?`,
        [cartID]);
        con.query(query, function (err, result) {
            if (err) throw err;
            console.log("Cart Purchased");
        });
        
        // create new cart
        this.createCart();
    }
    */

    // helper function to obtain data about books
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

    // view items
    // outputs list of listings where listings are in format [ISBN, Title, Category, Author, Quantity, Price, Seller Username]
    async viewListings(isbn){
        let query = mysql.format(`SELECT * FROM Inventory WHERE isbn = ?`, [isbn]);
        let rawListings = await con.promise(query);
        let listings = [];
        let book = "";
        for(let i = 0; i < rawListings.length; i++){
            let query = mysql.format(`SELECT username FROM Users WHERE user_id = ?`,
            [rawListings[i].user_id]);
            let seller = await con.promise(query);
            book = await this.bookInfoFromListing(rawListings[i].item_id)
            listings.push([book.title, seller[0].username, rawListings[i].quantity, rawListings[i].price, rawListings[i].item_id]);
            // listings.push([book.isbn, book.title, book.category, book.author, rawListings[i].quantity, rawListings[i].price, seller[0].username]);
        }
        return listings;
    }

    async viewBooks(){
        var query = mysql.format("SELECT * FROM Books");
        var books = await con.promise(query);
        return books;
    }

    async viewCart(){
        let cartID = await this.getCartID();
        
        let query = mysql.format(`SELECT item_id FROM Cart_Items WHERE cart_id = ?`,
            [cartID]);
        let items = await con.promise(query);

        let books = [];

        for(let i = 0; i < items.length; i++){
            books.push(await this.bookInfoFromListing(items[i].item_id));
        }

        return books;
    }
    
}

module.exports = Buyer