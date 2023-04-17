var mysql = require('mysql');

var con = mysql.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:"root",
    database:"SELab"
});

con.promise = (sql, params) => {
    return new Promise((resolve, reject) => {
      
        con.query(sql,params, (err, result) => {
        
            if(err){reject(new Error());}
            
            else{resolve(result);}
        
        });
    });
};
con.connect();

const Admin = class{
    constructor(connection,user_id)
    {
        this.con = connection;
        this.userID = user_id;
    }
    get getUserID()
    {
        return this.userID;
    }
    
    async BlockedUser(user_id)
    {
        return new Promise((resolve, reject) => {

            var con = mysql.createConnection({
                host:"127.0.0.1",
                user:"root",
                password:"root",
                database:"SELab"
            });

            con.connect();

            var query = mysql.format("UPDATE SELab.users SET blocked_flag = 1 WHERE user_id = ?", [user_id]);
            con.query(query, function(err, result) {
                if (err) reject(err);
                if(result.affectedRows == 0)
                {
                    resolve(false);
                }
                else
                {
                    resolve(true);
                }
            
            });

            con.end();

        });
    }

    async unblock(user_id)
    { 
        return new Promise((resolve, reject) => {

            var con = mysql.createConnection({
                host:"127.0.0.1",
                user:"root",
                password:"root",
                database:"SELab"
            });

            con.connect();
            
            var query = mysql.format("UPDATE users SET blocked_flag = 0 WHERE user_id = ?", [user_id]);
            con.query(query, function(err, result) {
                if (err) reject(err);
                if(result.affectedRows == 0)
                {
                    resolve(false);
                }
                else
                {
                    resolve(true);
                }
            });
        
            con.end();

        });
    }

    async SetSeller(user_id)
    {
        return new Promise((resolve, reject) => {

            var con = mysql.createConnection({
                host:"127.0.0.1",
                user:"root",
                password:"root",
                database:"SELab"
            });

            con.connect();
        
            var query = mysql.format("UPDATE users SET type_flag = 1 WHERE user_id = ?", [user_id]);

            con.query(query, function(err, result) {
                console.log(result);
                if (err) reject(err);

                if(result.affectedRows == 0)
                {
                    resolve(false);
                }
                else
                {
                    resolve(true);
                }
            });

            con.end();

        });
    }

    async SetBuyer(user_id)
    {
        return new Promise((resolve, reject) => {
            
            var con = mysql.createConnection({
                host:"127.0.0.1",
                user:"root",
                password:"root",
                database:"SELab"
            });

            con.connect();

            var query = mysql.format("UPDATE users SET type_flag = 0 WHERE user_id = ?", [user_id]);
            con.query(query, function(err, result) {
                console.log(result);
                if (err) reject(err);
                if(result.affectedRows == 0)
                {
                    resolve(false);
                }
                else
                {
                    resolve(true);
                }
            });

            con.end();

        });
    }
};

module.exports = Admin;