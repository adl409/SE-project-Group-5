var ViewStock = require('../public/js/viewstock')

test('stock shown', async () =>{
    expect(await ViewStock.ViewStock(10)).toBe(true)
})