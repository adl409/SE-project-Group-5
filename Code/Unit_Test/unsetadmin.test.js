var UnSetAdmin = require('../public/js/unsetadmin')
var mysql = require('mysql')

test('UnSets Admin properly', async () =>{
    expect(await UnSetAdmin.UnSetAdmin(9)).toBe(true)
})

test('UnSet Admin should return false for invalid user ID', async () => {
    const result = await UnSetAdmin.UnSetAdmin(-1);
    expect(result).toBe(false);
  });

test('Should return true because user becomes loses admin permission', async() =>{
    const result = await UnSetAdmin.UnSetAdmin(9);
    expect(result).toBe(true);
})

test('UnSet Admin should throw an error when the database connection fails', async () => {
    const con = {
      query: jest.fn((query, params, callback) => callback(new Error('Connection Error')))
    };
    try{
    const result = await UnSetAdmin.UnSetAdmin(1, con);
    
    await expect(result).rejects.toThrow('Connection Error');
    }
    catch(Error){
        expect(Error).toBeDefined();
    }
  });

test('UnSet Admin should return false when no rows are affected', async () => {
    const result = await UnSetAdmin.UnSetAdmin(-1);
    expect(result).toBe(false);
  });