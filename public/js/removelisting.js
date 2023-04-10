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

async function RemoveListing(item_id, isbn)
{
    return new Promise((resolve, reject) => {

        var query = mysql.format("DELETE FROM inventory WHERE item_id = ? AND isbn = ?", [item_id, isbn]);
        con.query(query, function(err, result) {
            if (err) reject(err);
            if(result.length == 0)
            {
                resolve(false);
            }
            else
            {
                resolve(true);
                console.log('item removed successfully')
            }
            con.end()
        });
        
    });
}

exports.BlockedUser = BlockedUser;