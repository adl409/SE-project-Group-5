var mysql = require('mysql');
const Buyer = require('../Classes/buyer'); 

var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "SELab"
  });
  
con.connect();

var lib = new Buyer(con, 1)

test('Get Username', async () => {
    const result = await lib.getUsername();
    expect(result).toBe("Bob");
    });

test('Create Cart', async () => {
    const result = await lib.createCart();
    expect(result).toBe(true);
        });

test('Get Cart ID', async () => {
   const result = await lib.getCartID();
   expect(result).toBe(37);
    });
         
 test('Add item to cart', async () => {
    const result = await lib.addItemToCart(1, 1, 37);
    expect(result).toBe(true);
     });

test('Add second item to cart', async () => {
   const result = await lib.addItemToCart(1, 2, 37);
   expect(result).toBe(true);
    });

 test('Remove item from cart', async () => {
    const result = await lib.removeItemFromCart(1);
    expect(result).toBe(true);
     });

 test('Checkout', async () => {
    const result = await lib.checkout();
    expect(result).toEqual([]);
     });

test('Adding item to cart after checkout', async () => {
   const result = await lib.addItemToCart(1, 3, 20);
   expect(result).toBe(true);
    });

test('Viewing cart', async () => {
    const result = await lib.viewCart();
    expect(result.length).toBeGreaterThan(0);
     });

test('Viewing books', async () => {
   const result = await lib.viewBooks();
   expect(result.length).toBeGreaterThan(0);
    });
    
con.end();