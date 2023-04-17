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

test('sets seller properly', async () =>{
    const result = await SetSeller.SetSeller(9);
    expect(result).toBe(true)
})

test('User ID does not exist', async () =>{
    const result = await SetSeller.SetSeller(20);
    expect(result).toBe(false)
})

test('User is already a seller', async() =>{
    const result = await SetSeller.SetSeller(9);
    expect(result).toBe(true);
})

test('Set Seller should throw an error when the database connection fails', async () => {
    const con = {
      query: jest.fn((query, params, callback) => callback(new Error('Connection Error')))
    };
    try{
    const result = SetSeller.SetSeller(9, con);
    
    await expect(result).rejects.toThrow('Connection Error');
    }
    catch(Error){
        expect(Error).toBeDefined();
    }
  });

test('SetSeller should return false when no rows are affected', async () => {
    const result = await SetSeller.SetSeller(-1);
    expect(result).toBe(false);
  });

  con.end();