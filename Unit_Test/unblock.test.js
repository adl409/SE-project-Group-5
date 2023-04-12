var unblock = require('../public/js/unblock')


test('user unblocked successfully', async () =>{
    const result = await unblock.unblock(7);
    expect(result).toBe(true)
});


test('unblock should return false for invalid user ID', async () => {
    const result = await unblock.unblock(-1);
    expect(result).toBe(false);
  });

  test('UnSet Admin should return false when no rows are affected', async () => {
    const result = await unblock.unblock(0);
    expect(result).toBe(false);
  });

test('unblock should return false for string user ID', async () => {
    const result = await unblock.unblock('user123');
    expect(result).toBe(false);
});

test('unblock should return false for undefined user ID', async () => {
    const result = await unblock.unblock(undefined);
    expect(result).toBe(false);
  });