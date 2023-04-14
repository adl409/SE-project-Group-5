var mysql = require('mysql');
const lib = require('../buyerFunctions.js'); 

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "SELab"
  });

let buyer = 9;


test('Get Username', async () => {
    const result = await lib.getUsername(con, buyer);
    expect(result).toBe("Bob");
    });

test('Get Cart ID', async () => {
   const result = await lib.getCartID(con, buyer);
   expect(result).toBe(9);
    });

 test('Create Cart', async () => {
     const result = await lib.createCart(con, buyer);
     expect(result).toBe(true);
      });
         
 test('Add item to cart', async () => {
    const result = await lib.addItemToCart(con, buyer, 4, 1);
    expect(result).toBe(true);
     });

test('Add second item to cart', async () => {
   const result = await lib.addItemToCart(con, buyer, 4, 2);
   expect(result).toBe(true);
    });

 test('Remove item from cart', async () => {
    const result = await lib.removeItemFromCart(con, buyer, 4);
    expect(result).toBe(true);
     });

 test('Checkout', async () => {
    const result = await lib.checkout(con, buyer);
    expect(result).toEqual([]);
     });

test('Adding item to cart after checkout', async () => {
   const result = await lib.addItemToCart(con, buyer, 3, 2);
   expect(result).toBe(true);
    });

test('Viewing cart', async () => {
    const result = await lib.viewCart(con, buyer);
    expect(result.length).toBeGreaterThan(0);
     });

test('Viewing books', async () => {
   const result = await lib.viewBooks(con);
   expect(result.length).toBeGreaterThan(0);
    });
    