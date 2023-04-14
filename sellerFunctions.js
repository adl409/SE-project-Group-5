var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "SELab"
});

// ADD Balance to sellers

con.promise = (sql, params) => {
    return new Promise((resolve, reject) => {
      
        con.query(sql,params, (err, result) => {
        
        if(err){reject(new Error());}
        
        else{resolve(result);}
        
    });
    });
};
module.exports = con;

async function createListing(con, userID, isbn, quantity, price){
    return new Promise((resolve, reject) => {

        let query = mysql.format(`INSERT INTO Inventory SET 
        quantity = ?,
        user_id = ?,
        price = ?,
        isbn = ?`,
        [quantity, userID, price, isbn]);
        
        con.query(query, function(err, result) {
            if (err) reject(err);

            if (result.affectedRows == 0)
            {
                resolve(false);
            }
            else
            {
                resolve(true);
            }
        });
    });
}



async function updatePricing(con, userID, isbn, price){
    return new Promise((resolve, reject) => {

        let query = mysql.format(`UPDATE Inventory SET price = ? WHERE 
        user_id = ? AND
        isbn = ?`,
        [price, userID, isbn]);
        con.query(query, function(err, result) {
            if (err) reject(err);

            if (result.affectedRows == 0)
            {
                resolve(false);
            }
            else
            {
                resolve(true);
            }
        });
    });

}

async function updateQuantity(con, userID, isbn, quantity){
    
    return new Promise((resolve, reject) => {

        let query = mysql.format(`UPDATE Inventory SET quantity = ? WHERE 
        user_id = ? AND
        isbn = ?`,
        [quantity, userID, isbn]);
        con.query(query, function(err, result) {
            if (err) reject(err);

            if (result.affectedRows == 0)
            {
                resolve(false);
            }
            else
            {
                resolve(true);
            }
        });
    });
}
// remove from cart
async function removeListing(con, userID, isbn){

    return new Promise((resolve, reject) => {

        let query = mysql.format(`DELETE FROM Inventory WHERE 
        isbn = ? AND user_id = ?`,
        [isbn, userID]);
        con.query(query, function(err, result) {
            if (err) reject(err);

            if (result.affectedRows == 0)
            {
                resolve(false);
            }
            else
            {
                resolve(true);
            }
        });
    });
}
async function bookInfoFromListing(con, itemID){
    let query = mysql.format(`SELECT isbn FROM Inventory WHERE item_id = ?`,
        [itemID]);
    let isbn = await new Promise((resolve, reject) => {
      
        con.query(query, (err, result) => {
        
        if(err){reject(new Error());}
        
        else{resolve(result);}
        
    });
    });
    isbn = isbn[0].isbn;
    query = mysql.format(`SELECT * FROM Books WHERE isbn  = ?`,
        [isbn]);
    let bookInfo = await new Promise((resolve, reject) => {
      
        con.query(query, (err, result) => {
        
        if(err){reject(new Error());}
        
        else{resolve(result);}
        
    });
    });

    return bookInfo[0];
}
// view listings
async function getListings(con, userID){
    let query = mysql.format(`SELECT * FROM Inventory WHERE user_id = ?`,
        [userID]);
    let items = await new Promise((resolve, reject) => {
      
        con.query(query, (err, result) => {
        
        if(err){reject(new Error());}
        
        else{resolve(result);}
        
    });
    });
    let books = [];
    for(let i = 0; i < items.length; i++){
        books.push([await bookInfoFromListing(con, items[i].item_id), items[i].quantity, items[i].price]);
    }
    return books;
}
   
async function login(con, username, password){
   let query = mysql.format(`SELECT * FROM Users WHERE username = ? AND password = ?`, [username, password]);
   results = await con.promise(query, username, password);
   let type = results[0].type_flag;
   
    return results[0].user_id;
}

module.exports = {createListing, updatePricing, updateQuantity, removeListing, bookInfoFromListing, getListings}