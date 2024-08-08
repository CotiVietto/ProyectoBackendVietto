import express from 'express';
import ProductManager from '../../dao/MongoDB/ProductManager.js';

const router = express.Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
  try {
    const products = await productManager.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).send('Error al obtener los productos');
  }
});

router.post('/', async (req, res) => {
  try {
    const newProduct = req.body;
    const product = await productManager.addProduct(newProduct);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error al agregar el producto:', error);
    res.status(500).send('Error al agregar el producto');
  }
});

export default router;
