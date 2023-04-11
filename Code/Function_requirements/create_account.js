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

    var userId = await getNumUsers() + 1;

    var flag = await validUser(username);

    return new Promise((resolve, reject) => {

        if(flag)
        {
            console.log("This works");
            var query = mysql.format("INSERT INTO Users (user_id, username, type_flag, password, email)", [userId, username, 0, password, email]);
            con.query(query, function(err, result) {
                if (err) reject(err);
                if (!result.length)
                {
                    resolve(false);
                }
                else
                {
                    resolve(true);
                }
            });
        }
        else
        {
            console.log("This didn't work");
        }

        
        con.end();
    });
}

async function getNumUsers()
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

        var query = "SELECT * FROM Users";
        con.query(query, function(err, result)
        {
            if (err) reject(err);
            resolve(result.length);
        });
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