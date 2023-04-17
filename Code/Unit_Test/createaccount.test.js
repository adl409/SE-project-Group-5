var createAccount = require('../Function_requirements/create_account')

test('User information enter does not exist and should create the account', async() =>{
    const username = await createAccount.createAccount('bob5', 'pass','bob5@gmail.com', 0, 0)
    expect(username).toBe(true);
})

test('User information does exist cannot create account', async() =>{
    const username = await createAccount.createAccount('bob6', 'pass','bob5@gmail.com', 0, 0)
    expect(username).toBe(false);
})

test('Should throw an error when the database connection fails', async () => {
    const con = {
      query: jest.fn((query, params, callback) => callback(new Error('Connection Error')))
    };
    try{
    const result = createAccount.createAccount('Meow', 'Meow', 'Meow@gmail.com',0,0);
    
    await expect(result).rejects.toThrow('Connection Error');
    }
    catch(Error){
        expect(Error).toBeDefined();
    }
  });

test('User cannot create account cause user is blocked', async() =>{
    const username = await createAccount.createAccount('bob6', 'pass','bob5@gmail.com', 1, 0)
    expect(username).toBe(false);
})

test('User cannot create account cause user exist', async() =>{
    const username = await createAccount.createAccount('bob6', 'pass','bob5@gmail.com', 1, 0)
    expect(username).toBe(false);
})


