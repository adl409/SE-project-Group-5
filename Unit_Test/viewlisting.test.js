//var  viewListings = require('../public/js/viewlisting')
var mysql = require('mysql')

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "se_group5"
  });


  con.promise = (sql, params) => {
    return new Promise((resolve, reject) => {
      
        con.query(sql,params, (err, result) => {
        
        if(err){reject(err);}
        
        else{resolve(result);}
        
        });
       });
    };

test('item is viewed', async () =>{
    expect(await con.promise(mysql.format(`SELECT username FROM Users WHERE user_id = ?`,[7]))).toEqual([{username: 'Nathan'}]);
})

