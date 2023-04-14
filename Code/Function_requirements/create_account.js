var mysql = require('mysql');

async function createAccount(username, password, email, blocked_flag, seller_auth_flag)
{
    var con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"SELab"
    });
    
    con.connect(function(err) {
        if (err) throw err;
    });

    var flag = await validUser(username);
    
    return new Promise((resolve, reject) => {

        if(flag == true)
        {
            var query = mysql.format(`INSERT INTO users SET
            username = ?,type_flag = ?,password = ?,email = ?,blocked_flag = ?`,[username, 0, password, email, 0, 0]);

            con.query(query, function(err, result) {
                if (err) reject(err);
                console.log("1 record inserted");
                resolve(true);
            });
        }
        else
        {
            resolve(false);
        }

        
        con.end();
    });
}

function validUser(username)
{
    var con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"SELab"
    });
    
    con.connect(function(err) {
        if (err) throw err;
    });

    return new Promise((resolve, reject) => {

        var query = mysql.format("SELECT * FROM Users WHERE username = ?",[username]);
        con.query(query, function(err, result)
        {
            if (err) reject(err);
            if(result.length != 0)
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

exports.createAccount = createAccount;