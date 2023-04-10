var SetAdmin = require('../public/js/admin')

test('sets admin properly', async () =>{
    expect(await SetAdmin.SetAdmin(1)).toBe(true)
})