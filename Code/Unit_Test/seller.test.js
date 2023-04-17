var mysql = require('mysql');
const Seller = require('../Classes/seller'); 

var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "SELab"
  });

con.connect();

var lib = new Seller(con, 1)

test('Create Listing', async () => {
    const result = await lib.createListing(375826688, 6, 20);
    expect(result).toBe(true);
  });

// test('Update Pricing', async () => {
//   const result = await lib.updatePricing(375826688, 12);
//   expect(result).toBe(true);
// });

// test('Update Quantity', async () => {
//     const result = await lib.updateQuantity(375826688, 13);
//     expect(result).toBe(true);
//   });

// test('Remove Listing', async () => {
//   const result = await lib.removeListing(375826688);
//   expect(result).toBe(true);
// });

// test('List book info', async () => {
//   const result = await lib.bookInfoFromListing(3);
//   expect(result.author).toEqual("Rick Riordan");
// });

// test('List all listings', async () => {
//   const result = await lib.getListings();
//   expect(result.length).toBeGreaterThan(0);
// });

// con.end();
