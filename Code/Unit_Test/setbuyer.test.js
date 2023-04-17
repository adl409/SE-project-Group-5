var Owner = require('../Classes/owner')
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "SELab"
});

con.connect();

var user = new Owner(con, 1);

test('UnSets Admin properly', async () =>{
    expect(await user.SetBuyer(2)).toBe(true)
})

test('UnSet Admin should return false for invalid user ID', async () => {
    const result = await user.SetBuyer(-1);
    expect(result).toBe(false);
  });

test('Should return true because user becomes loses admin permission', async() =>{
    const result = await user.SetBuyer(3);
    expect(result).toBe(true);
})

test('UnSet Admin should throw an error when the database connection fails', async () => {
    const con = {
      query: jest.fn((query, params, callback) => callback(new Error('Connection Error')))
    };
    try{
    const result = await user.SetBuyer(1, con);
    
    await expect(result).rejects.toThrow('Connection Error');
    }
    catch(Error){
        expect(Error).toBeDefined();
    }
  });

test('UnSet Admin should return false when no rows are affected', async () => {
    const result = await user.SetBuyer(-1);
    expect(result).toBe(false);
  });

con.end();