
var mysql = require('mysql')

var con = mysql.createConnection
({
    host:"localhost",
    user:"root",
    password:"",
    database:"testing"
})

con.connect(function(err) {
    if (err) throw err;
});

async function BlockedUser(user_ID)
{
    return new Promise((resolve, reject) => {

        var query = mysql.format("UPDATE users SET type_flag = 4 WHERE user_id = ?", [user_ID]);
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

exports.BlockedUser = BlockedUser;