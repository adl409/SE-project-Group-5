var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "testing"
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

var query =mysql.format('SELECT FROM users WHERE user_id = ?'[user_id]) ;

connection.query(sql, (error, results, fields) => {
  if (error) throw error;

  const people = results.map(row => new Person(row.user_id, row.username, row.type_flag, row.email));

  console.log(people);
});

con.end();

const owner = class{
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