import express from 'express';
import CartManager from '../dao/mongoDB/CartManager.js';
import ProductManager from '../dao/mongoDB/ProductManager.js';

const router = express.Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
  try {
    const carts = await cartManager.getAllCarts();
    res.json(carts);
  } catch (error) {
    console.error('Error al obtener todos los carritos:', error.message);
    res.status(500).send('Error al obtener todos los carritos');
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }
    res.render('cart', { cart }); 
  } catch (error) {
    console.error('Error al obtener el carrito:', error.message);
    res.status(500).send('Error al obtener el carrito');
  }
});

router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({ cartId: newCart._id });
  } catch (error) {
    console.error('Error al crear el carrito:', error.message);
    res.status(500).send('Error al crear el carrito');
  }
});

router.post('/add-product', async (req, res) => {
  try {
    const { cartId, productId, quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).send('Cantidad inválida');
    }

    if (!cartId || !productId) {
      return res.status(400).send('ID del carrito o producto no proporcionado');
    }

    const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);

    res.redirect(`/carts/${cartId}`);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error.message);
    res.status(500).send('Error al agregar producto al carrito');
  }
});

router.post('/carts/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params; 
    const { quantity } = req.body; 

    if (!quantity || quantity <= 0) {
      return res.status(400).send('Cantidad inválida');
    }

    const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);


    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error.message);
    res.status(500).send('Error al agregar producto al carrito');
  }
});

export default router;