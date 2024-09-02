import mongoose from 'mongoose';
import express from 'express';
import ProductManager from '../dao/mongoDB/ProductManager.js';
import CartManager from '../dao/mongoDB/CartManager.js';

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getAllProducts();
  res.render('realTimeProducts', { products });
});

router.get('/products', async (req, res) => {
  const { limit = 10, page = 1, sort = '', query = '' } = req.query;
  const filter = {};
  if (query && query !== 'undefined') {
    const parsedQuery = JSON.parse(query);
    const { category, status } = parsedQuery;
    if (category) filter.category = category;
    if (status !== undefined) filter.status = status === 'true';
  }
  const sortOption = {};
  if (sort === 'asc') sortOption.price = 1;
  else if (sort === 'desc') sortOption.price = -1;

  const options = {
    limit: parseInt(limit),
    page: parseInt(page),
    sort: sortOption
  };

  const result = await productManager.getProducts(filter, options);
  res.render('index', {
    products: result.docs,
    totalPages: result.totalPages,
    prevPage: result.hasPrevPage ? result.prevPage : null,
    nextPage: result.hasNextPage ? result.nextPage : null,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage ? `/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
    nextLink: result.hasNextPage ? `/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null
  });
});

router.get('/products/:pid', async (req, res) => {
  const productId = req.params.pid;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).send('Invalid product ID');
  }

  const product = await productManager.getProductById(productId);
  const carts = await cartManager.getAllCarts();

  if (!product) {
    return res.status(404).send('Producto no encontrado');
  }

  res.render('product', { product, carts });
});

export default router;
