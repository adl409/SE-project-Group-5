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

// TODO
// add seller authorization check


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

        return true;
    }

    async updatePricing(isbn, price){
        let query = mysql.format(`UPDATE Inventory SET price = ? WHERE 
        user_id = ?,
        isbn = ?,`,
        [price, this.userID, isbn]);
        con.query(query, function (err, result) {
            if (err) return false;
            console.log("Pricing Updated");
            return true;
        });
    }

    async updateQuantity(isbn, quantity){
        let query = mysql.format(`UPDATE Inventory SET quantity = ? WHERE 
        user_id = ?,
        isbn = ?,`,
        [quantity, this.userID, isbn]);
        con.query(query, function (err, result) {
            if (err) throw err;
            console.log("Quantity Updated");
        });
        
        return true;
    }

    // remove from cart
    async removeListing(isbn){
        // FIXME
        
        let query = mysql.format(`DELETE FROM Inventory WHERE 
        isbn = ? AND user_id = ?`,
        [isbn, this.userID]);

        con.query(query, function (err, result) {
            if (err) return false;
            console.log("Listing Removed");
            return true;
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

        let query = mysql.format(`SELECT * FROM Inventory WHERE user_id = ?`,
            [this.userID]);
        let items = await con.promise(query);

        let books = [];

        for(let i = 0; i < items.length; i++){
            books.push([await this.bookInfoFromListing(items[i].item_id), items[i].quantity, items[i].price]);
        }

        return books;
    }
    
}

async function login(con, username, password){
    let query = mysql.format(`SELECT * FROM Users WHERE username = ? AND password = ?`, [username, password]);
    results = await con.promise(query, username, password);
    let type = results[0].type_flag;
    
    let user = "FAILURE";

    if(type == 0){
        user = new Buyer(con, results[0].user_id);
    }
    if(type == 1){
        user = new Seller(con, results[0].user_id);
    }
    

    return user;
}

async function main(){

    let user = await login(con, "Nathan", "pass");

    console.log(await user.getListings());

    //console.log(await user.bookInfoFromListing('3'));

    //user.addItemToCart('1', '4');
    //user.addItemToCart('2', '4');
    //user.addItemToCart('3', '4');
    //user.removeItemFromCart('4');

}

main();