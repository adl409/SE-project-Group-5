var mysql = require('mysql');
const { get } = require('request');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "se_group5"
});

con.promise = (sql, params) => {
    return new Promise((resolve, reject) => {
      
        con.query(sql,params, (err, result) => {
        
        if(err){reject(new Error());}
        
        else{resolve(result);}
        
    });
       });
};
con.connect()

var query =mysql.format('SELECT FROM users WHERE type_flag = ?'[user_id]) ;

connection.query(sql, (error, results, fields) => {
  if (error) throw error;

  const user = results.map(row => new Person(row.user_id, row.username, row.type_flag, row.email));

  console.log(user);
});

con.end();

const admin = class{
    constructor(connection,user_id,username,type_flag,email)
    {
        this.con = connection;
        this.userID = user_id;
    }
    get getUserID()
    {
        return this.userID
    }

}

exports.Admin = admin