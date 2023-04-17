var Admin = require('../Classes/admin')
var mysql = require('mysql')

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "SELab"
});

con.connect();

var user = new Admin(con, 1);

test('user blocked successfully', async () =>{
    const result = await user.BlockedUser(2);
    expect(result).toBe(true)
});


test('BlockedUser should return false for invalid user ID', async () => {
    const result = await user.BlockedUser(-1);
    expect(result).toBe(false);
  });

test('BlockedUser should return false for invalid user ID', async () => {
    const result = await user.BlockedUser(0);
    expect(result).toBe(false);
});

test('BlockedUser should return true for valid user ID', async () => {
    const result = await user.BlockedUser(4);
    expect(result).toBe(true);
});

test('BlockedUser should return false for undefined user ID', async () => {
    const result = await user.BlockedUser(undefined);
    expect(result).toBe(false);
  });

con.end();