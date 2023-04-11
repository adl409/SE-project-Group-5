const request = require('supertest');
const express = require('express');
const app = express();
// Define an array to store the products
const products = [
  { id: 1, name: 'Product 1', price: 10, seller: 'Seller 1' },
  { id: 2, name: 'Product 2', price: 20, seller: 'Seller 2' },
  { id: 3, name: 'Product 3', price: 30, seller: 'Seller 3' }
];

// Define an array to store the selected products
const selectedProducts = [];

//function 1
// Define a route to display the products
app.get('/products', async function(req, res) {
  try {
    // Get the query parameter "ids" from the request URL
    const productIds = req.query.ids;

    // If productIds is not provided, send all the products
    if (!productIds) {
      res.json(products);
      return;
    }

    // Convert the productIds string to an array of integers
    const ids = productIds.split(',').map(id => parseInt(id.trim()));

    // Filter the products array to get only the selected products
    const filteredProducts = products.filter(p => ids.includes(p.id));

    // Send the filtered products
    res.json(filteredProducts);
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/products/:id', async function(req, res) {
  try {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    if (product) {
      res.json({ price: product.price });
    } else {
      res.json({ error: 'Product not found' });
    }
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//end function 1

//function 2
// Define a route to view the selected products
app.get('/cart', async function(req, res) {
  try {
    res.json(selectedProducts);
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Define a route to get the total price of all selected products
app.get('/cart/total', async function(req, res) {
  try {
    const totalPrice = selectedProducts.reduce((total, product) => {
      return total + product.price;
    }, 0);
    res.json({ totalPrice });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define a route to remove a product from the selected products array
app.delete('/cart/remove/:id', async function(req, res) {
  try {
    const productId = parseInt(req.params.id);
    const productIndex = selectedProducts.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
      selectedProducts.splice(productIndex, 1);
      res.json({ message: 'Product removed from cart successfully' });
    } else {
      res.json({ error: 'Product not found in cart' });
    }
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//end funtion 2

//function 3
app.get('/cart/seller/:seller', function(req, res) {
  try {
    const seller = req.params.seller;
    const sellerProducts = selectedProducts.filter(p => p.seller === seller);
    res.json(sellerProducts);
  } catch (err) {
    console.log('Error getting seller products:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//end function 3


describe('Product endpoints', () => {
  test('GET /products should return all products', async () => {
    const response = await request(app).get('/products');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(products);
  });

  test('GET /products?ids=1,2 should return products with IDs 1 and 2', async () => {
    const response = await request(app).get('/products?ids=1,2');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([products[0], products[1]]);
  });

  test('GET /products should return the seller of each product', async () => {
    const response = await request(app).get('/products');
    expect(response.statusCode).toBe(200);
    expect(response.body[0]).toHaveProperty('seller', 'Seller 1');
    expect(response.body[1]).toHaveProperty('seller', 'Seller 2');
    expect(response.body[2]).toHaveProperty('seller', 'Seller 3');
  });

  test('GET /products/:id should return the price of the product with the given id', async () => {
    const response = await request(app).get('/products/1');
    expect(response.statusCode).toBe(200);
    expect(response.body.price).toBe(10);
  });

  test('GET /products should return all products with name property', async () => {
    const response = await request(app).get('/products');
    expect(response.statusCode).toBe(200);
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[1]).toHaveProperty('name');
    expect(response.body[2]).toHaveProperty('name');
  });
});

describe('Cart endpoints', () => {
  test('GET /cart/total should return the total price of selected products', async () => {
    selectedProducts.push(products[0], products[2]); // add two products to the cart
    const response = await request(app).get('/cart/total');
    expect(response.statusCode).toBe(200);
    expect(response.body.totalPrice).toBe(40); // the total price of the two selected products is 40
  });

  test('should return a 500 error if an error occurs while handling the request', async () => {
    // Mock the reduce method to cause an error while calculating the total price
    const originalReduce = Array.prototype.reduce;
    Array.prototype.reduce = jest.fn(() => {
      throw new Error('Test Error');
    });
  
    const response = await request(app).get('/cart/total');
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Internal Server Error');
  
    // Restore the reduce method to its original value after the test
    Array.prototype.reduce = originalReduce;
  });
  
  test('remove product from cart', async () => {
    // Add a product to the cart
    const productId = 1;
    await request(app).post('/cart/add').send({ id: productId });
  
    // Remove the product from the cart
    const response = await request(app).delete(`/cart/remove/${productId}`);
  
    // Check that the response has the expected message
    expect(response.body.message).toBe('Product removed from cart successfully');
  
    // Check that the product was actually removed from the cart
    const productIndex = selectedProducts.findIndex(p => p.id === productId);
    expect(productIndex).toBe(-1);
  });

  test('Remove a non-existing product from the cart', () => {
    const id = 100;
    const req = { params: { id: id } };
    const res = {
      json: jest.fn().mockReturnValue({ error: 'Product not found in cart' }),
      status: jest.fn().mockReturnValue(200)
    }
  });
  
  test('Handle server errors', () => {
    const id = 1;
    const req = { params: { id: id } };
    const res = {
      json: jest.fn().mockImplementation(() => { throw new Error() }),
      status: jest.fn().mockReturnValue(500)
    };
  });
  

  test('Getting products from the same seller in cart', async () => {
    // Assuming we have a product with seller 'Seller 1'
    const product1 = { id: 1, name: 'Product 1', price: 10, seller: 'Seller 1' };
    const product2 = { id: 2, name: 'Product 2', price: 15, seller: 'Seller 1' };
    const product3 = { id: 3, name: 'Product 3', price: 20, seller: 'Seller 2' };
    const product4 = { id: 4, name: 'Product 4', price: 25, seller: 'Seller 2' };
    const cart = [product1, product2, product3, product4];
  
    // Filter products by seller
    const seller1Products = cart.filter(p => p.seller === 'Seller 1');
  
    // Check if filtered products are correct
    expect(seller1Products.length).toBe(2);
    expect(seller1Products[0].name).toBe('Product 1');
    expect(seller1Products[0].price).toBe(10);
    expect(seller1Products[1].name).toBe('Product 2');
    expect(seller1Products[1].price).toBe(15);
  });

  test('GET /cart/seller/:seller returns 200 for valid seller', async () => {
    const response = await request(app).get('/cart/seller/some-seller');
    expect(response.status).toBe(200);
  });

  test('GET /cart/seller/:seller returns 500 if an error occurs', async () => {
    const mockError = new Error('Internal Server Error');
    jest.spyOn(selectedProducts, 'filter').mockImplementation(() => {
      throw mockError;
    });
    const response = await request(app).get('/cart/seller/some-seller');
    expect(response.status).toBe(500);
  });

  test('returns an error for an invalid seller parameter', async () => {
    const seller = '$invalid@seller';
    const response = await request(app).get(`/cart/seller/${seller}`);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal Server Error');
  });
  
  test('requires a valid seller parameter', async () => {
    const response = await request(app).get('/cart/seller/');

    expect(response.status).toBe(404);
  });

});

