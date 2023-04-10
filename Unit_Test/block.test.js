var BlockedUser = require('../public/js/block')

test('user blocked successfully', async () =>{
    expect(await BlockedUser.BlockedUser(4)).toBe(true)
})

