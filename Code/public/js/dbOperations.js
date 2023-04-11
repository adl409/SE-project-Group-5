var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "SELab"
});

/*
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
*/

function printInventory(con){
    con.query('SELECT * FROM Books', (err,rows) => {
        if(err) throw err;
        for(let i = 0; i < rows.length; i++){
            console.log(i+1, ": | TITLE: " , rows[i].title, " | AUTHOR", rows[i].author, " | GENRE: ", rows[i].category);
        }
    });   
}


function createUser(con, username, password, email, type){
    let query = mysql.format(`INSERT INTO Users SET
        username = ?,
        type_flag = ?,
	    password = ?,
        email = ?`,
        [username, type, password, email]);
    con.query(query, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    });

}

function createCart(con, userID){
    let query = mysql.format(`INSERT INTO Users SET
        user_id = ?,
        purchased_flag = ?`,
        [username, '0']);
    con.query(query, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    });
}

//function addItemToCart(con, itemID)

const User = class{
    constructor(connection, username){
        this.connection = connection;
        this.username = username;
        this.userID = "adsf";
        // queries for userid matching username
        // need to add input filtering for unique usernames

        let query = mysql.format(`SELECT user_id FROM Users WHERE username = ?`, [username]);
        con.query(query, function (err, result) {
            if (err) throw err;
            this.userID = result[0].user_id;
        });
    }

    get getUserID() {
        console.log(this.userID);
        return this.userID;
    }
}

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

let activeUser = new User(con, "Bob");
console.log(activeUser.getUserID);

//showInventory(con);
//addUser(con, "Nathan", "pass", "nml@gmail.com",'1');
