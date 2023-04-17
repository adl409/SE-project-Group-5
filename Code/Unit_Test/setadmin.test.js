var Owner = require('../Classes/owner')
var mysql = require('mysql')

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "SELab"
});

con.connect();

var user = new Owner(con, 1);

test('Sets Admin properly', async () =>{
    expect(await user.SetAdmin(2)).toBe(true)
})

test('Set Admin should return false for invalid user ID', async () => {
    const result = await user.SetAdmin(-1);
    expect(result).toBe(false);
  });

test('Should return true because user becomes an admin', async() =>{
    const result = await user.SetAdmin(3);
    expect(result).toBe(true);
})

test('Set Admin should throw an error when the database connection fails', async () => {
    const con = {
      query: jest.fn((query, params, callback) => callback(new Error('Connection Error')))
    };
    try{
    const result = await user.SetAdmin(1, con);
    
    await expect(result).rejects.toThrow('Connection Error');
    }
    catch(Error){
        expect(Error).toBeDefined();
    }
  });

test('Set Admin should return false when no rows are affected', async () => {
    const result = await user.SetAdmin(-1);
    expect(result).toBe(false);
  });

con.end();