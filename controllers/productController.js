const Product = require('../models/productModel');
const User = require('../models/userModel');

// Controller to create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;

    // Check if the product with the same name already exists
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res
        .status(400)
        .json({ message: 'Product with this name already exists' });
    }

    const newProduct = new Product({
      name,
      price,
      // Add other fields if necessary
    });

    const savedProduct = await newProduct.save();

    res
      .status(201)
      .json({ message: 'Product created successfully', product: savedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, price, updatedAt: Date.now() }, // Update the necessary fields
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product deleted successfully',
      product: deletedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.user.id;
    console.log(userId);

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if the product is already in the user's shopping cart
    const existingCartItem = user.shoppingCart.find((item) => {
      if (
        item.product &&
        typeof item.product === 'object' &&
        item.product.toString
      ) {
        return item.product.toString() === productId;
      }
      return false;
    });

    if (existingCartItem) {
      // If the product is already in the cart, increment the quantity
      existingCartItem.quantity += 1;
    } else {
      // If the product is not in the cart, add it with quantity 1
      user.shoppingCart.push({ product: productId, quantity: 1 });
    }

    // Save the updated user with the new shopping cart
    await user.save();

    res.json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
