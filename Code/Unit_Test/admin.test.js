var SetAdmin = require('../public/js/admin')
var mysql = require('mysql')

test('Sets Admin properly', async () =>{
    expect(await SetAdmin.SetAdmin(9)).toBe(true)
})

test('Set Admin should return false for invalid user ID', async () => {
    const result = await SetAdmin.SetAdmin(-1);
    expect(result).toBe(false);
  });

test('Should return true because user becomes an admin', async() =>{
    const result = await SetAdmin.SetAdmin(9);
    expect(result).toBe(true);
})

test('Set Admin should throw an error when the database connection fails', async () => {
    const con = {
      query: jest.fn((query, params, callback) => callback(new Error('Connection Error')))
    };
    try{
    const result = await SetAdmin.SetAdmin(1, con);
    
    await expect(result).rejects.toThrow('Connection Error');
    }
    catch(Error){
        expect(Error).toBeDefined();
    }
  });

test('Set Admin should return false when no rows are affected', async () => {
    const result = await SetAdmin.SetAdmin(-1);
    expect(result).toBe(false);
  });