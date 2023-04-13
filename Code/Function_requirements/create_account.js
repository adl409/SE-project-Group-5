var mysql = require('mysql');

async function createAccount(username, password, email)
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

        if(flag)
        {
            var query = mysql.format(`INSERT INTO Users SET
            username = ?,
            type_flag = ?,
            password = ?,
            email = ?`, [username, 0, password, email]);

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
                resolve(true);
            }
            else
            {
                resolve(false);
            }
        });
        con.end();
    });
}

exports.createAccount = createAccount;