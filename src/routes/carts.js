import express from 'express';
import CartManager from '../dao/mongoDB/CartManager.js';

const router = express.Router();
const cartManager = new CartManager();

router.post('/', async (req, res) => {
  try {
    const newCart = req.body;
    const cart = await cartManager.createCart(newCart);
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).send('Error al crear el carrito');
  }
});

router.get('/', async (req, res) => {
  try {
    const carts = await cartManager.getAllCarts();
    res.json(carts);
  } catch (error) {
    res.status(500).send('Error al obtener los carritos');
  }
});

export default router;
