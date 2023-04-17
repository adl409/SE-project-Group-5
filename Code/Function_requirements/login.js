var mysql = require('mysql');

async function Login(username, password)
{

    var con = mysql.createConnection({
        host:"127.0.0.1",
        user:"root",
        password:"root",
        database:"SELab"
    });
    
    con.connect(function(err) {
        if (err) throw err;
    });

    return new Promise((resolve, reject) => {

        var query = mysql.format("SELECT * FROM SELab.users WHERE BINARY username = ? AND BINARY password = ?", [username, password]);
        con.query(query, function(err, result) {
            if (err) reject(err);
            if (!result.length)
            {
                resolve(false);
            }
            else
            {
                if(result[0].blocked_flag)
                {
                    resolve(false);
                }
                else
                {
                    resolve(true);
                }
            }
        });

        con.end();
    });
}

exports.Login = Login;
