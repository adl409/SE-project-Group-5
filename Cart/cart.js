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

// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
