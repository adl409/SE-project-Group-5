var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "SELab"
});



async function getUsername(con, userID){
    let query = mysql.format(`SELECT * FROM Users WHERE user_id = ?`, [userID]);
    results = await new Promise((resolve, reject) => {
      
        con.query(query, (err, result) => {
        
        if(err){reject(new Error());}
        
        else{resolve(result);}
        
        });
    });
    return results[0].username;
}

async function getCartID(con, userID){
    let query = mysql.format(`SELECT * FROM Carts WHERE user_id = ? AND purchased_flag = 0`, [userID]);
    results = await new Promise((resolve, reject) => {
      
        con.query(query, (err, result) => {
        
        if(err){reject(new Error());}
        
        else{resolve(result);}
        
    });
    });
    if(results.length == 0){
        createCart(con, userID);
        let query = mysql.format(`SELECT * FROM Carts WHERE user_id = ? AND purchased_flag = 0`, [UserID]);
        results = await new Promise((resolve, reject) => {
      
            con.query(query, (err, result) => {
            
            if(err){reject(new Error());}
            
            else{resolve(result);}
            
        });
        });
    }
    return results[0].cart_id;
}
// create cart
function createCart(con, userID){
    return new Promise((resolve, reject) => {

        let query = mysql.format(`INSERT INTO Carts SET
        user_id = ?,
        purchased_flag = ?`,
        [userID, '0']);
        
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

// add to cart
// need to check for stocks
async function addItemToCart(con, userID, itemID, quantity){
    let cartID = await getCartID(con, userID);
    
    return new Promise((resolve, reject) => {

        
        
        let query = mysql.format(`INSERT INTO Cart_Items SET 
        quantity = ?,
        cart_id = ?,
        item_id = ?`,
        [quantity, cartID, itemID]);

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
async function removeItemFromCart(con, UserID, itemID){
 
    let cartID = await getCartID(con, UserID);

    return new Promise((resolve, reject) => {

        
        let query = mysql.format(`DELETE FROM Cart_Items WHERE 
        item_id = ? AND cart_id = ?`,
        [itemID, cartID]);
        
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

// checkout
async function checkout(con, userID){
    let rejects = [];
    let cartID = await getCartID(con, userID);
    
    // check for stock
    
    let query = mysql.format(`SELECT quantity, item_id FROM Cart_Items WHERE cart_id = ?`,
        [cartID]);
    let items = await new Promise((resolve, reject) => {
      
        con.query(query, (err, result) => {
        
        if(err){reject(new Error());}
        
        else{resolve(result);}
        
    });
    });
    
    let temp;
    let inventory = [];
    // update quantities
    for(let j = 0; j < items.length; j++){
        let query = mysql.format(`SELECT isbn, quantity FROM Inventory WHERE item_id = ?`,
        [items[j].item_id]);
        temp = await new Promise((resolve, reject) => {
      
            con.query(query, (err, result) => {
            
            if(err){reject(new Error());}
            
            else{resolve(result);}
            
        });
        });
        inventory.push(temp[0].quantity);
    }
    
    
    for(let i = 0; i < items.length; i++){
        if(items[i].quantity >  inventory[i]){
            rejects.push(inventory[i].isbn)
            removeItemFromCart(con, userID, items[i].item_id);
        }
        else{
            let query = mysql.format(`UPDATE Inventory SET Quantity = ? WHERE 
            item_id = ?`,
            [inventory[i]-items[i].quantity, items[i].item_id]);
            con.query(query, function (err, result) {
                if (err) throw err;
                });
        }
    }
    // set purchased flag
    query = mysql.format(`UPDATE Carts SET purchased_flag = 1 WHERE 
    cart_id = ?`,
    [cartID]);
    con.query(query, function (err, result) {
        if (err) throw err;
    });
    
    // create new cart
    createCart(con, userID);
    
    return rejects;
}

// helper function to obtain data about books
async function bookInfoFromListing(itemID){
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
// view items
// outputs list of listings where each is in format [ISBN, Title, Category, Author, Quantity, Price, Seller]
async function viewListings(isbn){
    let query = mysql.format(`SELECT * FROM Inventory WHERE isbn = ?`, [isbn]);
    let rawListings = await con.promise(query);
    let listings = [];
    let book = "";
    for(let i = 0; i < rawListings.length; i++){
        let query = mysql.format(`SELECT username FROM Users WHERE user_id = ?`,
        [rawListings[i].user_id]);
        let seller = await con.promise(query);
        book = await this.bookInfoFromListing(rawListings[i].item_id)
        listings.push([book.isbn, book.title, book.category, book.author, rawListings[i].quantity, rawListings[i].price, seller[0].username]);
    }
    return listings;
}
// returns cart contents as a list of lists of format [isbn, title, category, author, price, quantity]
async function viewCart(con, userID){
    let cartID = await getCartID(con, userID);
    
    let query = mysql.format(`SELECT item_id, quantity FROM Cart_Items WHERE cart_id = ?`,
        [cartID]);
    let items = await new Promise((resolve, reject) => {
      
        con.query(query, (err, result) => {
        
        if(err){reject(new Error());}
        
        else{resolve(result);}
        
    });
    });
    let books = [];
    let book = [];
    let price = [];
    for(let i = 0; i < items.length; i++){
        query = mysql.format(`SELECT price FROM Inventory WHERE item_id = ?`,
        [items[i].item_id]);
        price = await new Promise((resolve, reject) => {
      
            con.query(query, (err, result) => {
            
            if(err){reject(new Error());}
            
            else{resolve(result);}
            
        });
        });
        book = await bookInfoFromListing(items[i].item_id)
        books.push([book.isbn, book.title, book.category, book.author, price[0].price, items[i].quantity]);
    }
    return books;
}

async function viewBooks(con){
    let query = mysql.format(`SELECT * FROM Books`);
    let books = await new Promise((resolve, reject) => {
      
        con.query(query, (err, result) => {
        
        if(err){reject(new Error());}
        
        else{resolve(result);}
        
    });
    });
    return books;
}

module.exports = {getUsername, getCartID, createCart, addItemToCart, removeItemFromCart, checkout, viewCart, viewBooks};