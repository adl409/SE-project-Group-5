var SetSeller = require('../public/js/seller')

test('sets seller properly', async () =>{
    expect(await SetSeller.SetSeller(2)).toBe(true)
})
