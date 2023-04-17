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

test('user unblocked successfully', async () =>{
    const result = await user.unblock(3);
    expect(result).toBe(true)
});


test('unblock should return false for invalid user ID', async () => {
    const result = await user.unblock(-1);
    expect(result).toBe(false);
  });

  test('UnSet Admin should return false when no rows are affected', async () => {
    const result = await user.unblock(0);
    expect(result).toBe(false);
  });

test('unblock should return true for unblocking successfully', async () => {
    const result = await user.unblock(2);
    expect(result).toBe(true);
});

test('unblock should return false for undefined user ID', async () => {
    const result = await user.unblock(undefined);
    expect(result).toBe(false);
  });

con.end();