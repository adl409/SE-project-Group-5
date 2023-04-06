
/*
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
*/

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


con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });


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
    let query = mysql.format(`INSERT INTO Carts SET
        user_id = ?,
        purchased_flag = ?`,
        [username, '0']);
    con.query(query, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    });
}

function login(con, username, password, promise){
    let query = mysql.format(`SELECT * FROM Users WHERE username = ? AND password = ?`, [username, password]);
        con.query(query, function (err, result) {
            if (err) throw err;
            console.log(results[0].user_id);
            promise.resolve(results[0].user_id);
            });

}

/* IMPORTANT STUFF



*/

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

async function getUserID(con, username){
    var sql = mysql.format(`SELECT * from Users where username=?`, [username]);
    results = await con.promise(sql, username);
    
    return results;
    }


let temp = getUserID(con, "Bob");
