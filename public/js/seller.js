var mysql = require('mysql')

var con = mysql.createConnection
({
    host:"localhost",
    user:"root",
    password:"",
    database:"testing"
})

async function SetSeller(user_ID)
{
    return new Promise((resolve, reject) => {

        var query = mysql.format("UPDATE users SET type_flag = 1 WHERE user_id = ?", [user_ID]);
        con.query(query, function(err, result) {
            if (err) reject(err);
            if(result.length == 0)
            {
                resolve(false);
            }
            else
            {
                resolve(true);
            }
            con.end()
        });
        
    });
}

exports.SetSeller = SetSeller;