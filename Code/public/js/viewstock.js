
var mysql = require('mysql')


async function ViewStock(item_id)
{
    return new Promise((resolve, reject) =>
    {
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

        var query = mysql.format("SELECT quantity FROM inventory WHERE item_id = ?", [item_id]);
        con.query(query, function(err, result)
        {
            if (err) reject(err);
                resolve(item_id)
            con.end();
        })
        
    });
}

exports.ViewStock = ViewStock