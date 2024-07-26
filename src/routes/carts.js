import express from 'express';
import CartManager from '../managers/CartManager.js';

const router = express.Router();
const cartManager = new CartManager('../src/data/carts.json');

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

router.post('/:cartId/products/:productId', async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const updatedCart = await cartManager.addProductToCart(Number(cartId), Number(productId));
        if (updatedCart) {
            res.status(200).json(updatedCart);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

router.get('/:cartId', async (req, res) => {
    try {
        const { cartId } = req.params;
        const cart = await cartManager.getCartById(Number(cartId));
        if (cart) {
            res.status(200).json(cart);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getAllCarts();
        res.json(carts); 
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los carritos' });
    }
});

export default router;

