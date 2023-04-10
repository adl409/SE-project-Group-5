var ViewPrice = require('../public/js/viewprice')

test('price shown', async () =>{
    expect(await ViewPrice.ViewPrice(11)).toBe(true)
})