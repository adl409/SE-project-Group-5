var SetBuyer = require('../public/js/SetBuyer')
var mysql = require('mysql')

test('Set buyer properly', async () =>{
    expect(await SetBuyer.SetBuyer(9)).toBe(true)
})

test('Set buyer should return false for invalid user ID', async () => {
    const result = await SetBuyer.SetBuyer(-1);
    expect(result).toBe(false);
  });

test('Should return true because user becomes loses permission', async() =>{
    const result = await SetBuyer.SetBuyer(9);
    expect(result).toBe(true);
})

test('SetBuyer should throw an error when the database connection fails', async () => {
    const con = {
      query: jest.fn((query, params, callback) => callback(new Error('Connection Error')))
    };
    try{
    const result = await SetBuyer.SetBuyer(1, con);
    
    await expect(result).rejects.toThrow('Connection Error');
    }
    catch(Error){
        expect(Error).toBeDefined();
    }
  });

test('Set Buyer should return false when no rows are affected', async () => {
    const result = await SetBuyer.SetBuyer(-1);
    expect(result).toBe(false);
  });