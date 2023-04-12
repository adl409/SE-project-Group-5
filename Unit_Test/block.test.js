var BlockedUser = require('../public/js/block')


test('user blocked successfully', async () =>{
    const result = await BlockedUser.BlockedUser(7);
    expect(result).toBe(true)
});


test('BlockedUser should return false for invalid user ID', async () => {
    const result = await BlockedUser.BlockedUser(-1);
    expect(result).toBe(false);
  });

test('BlockedUser should throw error for database query failure', async () => {
    expect.assertions(1);
    try {
      await Blockeduser.BlockedUser('invalid input');
    } catch (error) {
      expect(error).toBeDefined();
    }
});

test('BlockedUser should return false for string user ID', async () => {
    const result = await BlockedUser.BlockedUser('user123');
    expect(result).toBe(false);
});

test('BlockedUser should return false for undefined user ID', async () => {
    const result = await BlockedUser.BlockedUser(undefined);
    expect(result).toBe(false);
  });