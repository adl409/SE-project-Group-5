
var mysql = require('mysql')



async function ViewPrice(item_ID)
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
        
        var query = mysql.format("SELECT price FROM inventory WHERE item_id = ?", [item_ID]);
        con.query(query, function(err, result)
        {
            if (err) reject(err);
            
                resolve(item_ID)
            con.end()
        })
        
    });
}

exports.ViewPrice = ViewPrice;