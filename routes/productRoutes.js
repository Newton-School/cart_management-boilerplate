const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route to create a new product
router.post('/products', productController.createProduct);

// Route to get all products
router.get('/products', productController.getAllProducts);

// Route to get a single product by ID
router.get('/products/:id', productController.getProductById);

// Route to update a product by ID
router.put('/products/:id', productController.updateProduct);

// Route to delete a product by ID
router.delete('/products/:id', productController.deleteProduct);

// Route to add a product to the shopping cart
router.post(
  '/products/:productId/add-to-cart',
  authMiddleware.authenticateUser,
  productController.addToCart
);

module.exports = router;
