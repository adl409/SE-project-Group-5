
var mysql = require('mysql')


async function BlockedUser(user_ID)
{
    return new Promise((resolve, reject) => {

        var con = mysql.createConnection
        ({
        host:"localhost",
        user:"root",
        password:"",
        database:"se_group5"
        })

        con.connect(function(err) {
        if (err) throw err;
        }); 

        var query = mysql.format("UPDATE users SET blocked_flag = 1 WHERE user_id = ?", [user_ID]);
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
        con.end()
    });
}

exports.BlockedUser = BlockedUser;