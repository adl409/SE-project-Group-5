// Define an array to store the products
const products = [
  { id: 1, name: 'Product 1', price: 10 },
  { id: 2, name: 'Product 2', price: 20 },
  { id: 3, name: 'Product 3', price: 30 }
];

// Define an array to store the selected products
const selectedProducts = [];

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

// Define a route to add a product to the selected products array
app.post('/cart/add', async function(req, res) {
  try {
    const productId = req.body.productId;
    const product = products.find(p => p.id === productId);
    if (product) {
      selectedProducts.push(product);
      res.json({ message: 'Product added to cart successfully' });
    } else {
      res.json({ error: 'Product not found' });
    }
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define a route to view the selected products
app.get('/cart', async function(req, res) {
  try {
    res.json(selectedProducts);
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define a route to checkout the selected products
app.post('/cart/checkout', async function(req, res) {
  try {
    selectedProducts.length = 0;
    res.json({ message: 'Checkout successful' });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
