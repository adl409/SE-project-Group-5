
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


async function ViewStock(item_ID)
{
    return new Promise((resolve, reject) =>
    {
        var query = mysql.format("SELECT quantity FROM inventory WHERE item_id = ?", [item_ID]);
        con.query(query, function(err, result)
        {
            if (err) reject(err);
                resolve(result.quantity)
            con.end();
        })
        
    });
}

exports.ViewStock = ViewStock