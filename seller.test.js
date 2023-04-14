var mysql = require('mysql')
const lib = require('../sellerFunctions.js'); 

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "SELab"
  });

  module.exports = con;

let sellerID = 7;

test('Create Listing', async () => {
    const result = await lib.createListing(con, sellerID, 375826688, 6, 20);
    expect(result).toBe(true);
  });

test('Update Pricing', async () => {
  const result = await lib.updatePricing(con, sellerID, 375826688, 12);
  expect(result).toBe(true);
});

test('Update Quantity', async () => {
    const result = await lib.updateQuantity(con, sellerID, 375826688, 13);
    expect(result).toBe(true);
  });

test('Remove Listing', async () => {
  const result = await lib.removeListing(con, 7, 375826688);
  expect(result).toBe(true);
});

test('List book info', async () => {
  const result = await lib.bookInfoFromListing(con, 3);
  expect(result.author).toEqual("Rick Riordan");
});

test('List all listings', async () => {
  const result = await lib.getListings(con, 7, 375826688, 6, 20);
  expect(result.length).toBeGreaterThan(0);
});
