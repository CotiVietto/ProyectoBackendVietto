import express from 'express';
const router = express.Router();
import ProductManager from '../dao/mongoDB/ProductManager.js';

const productManager = new ProductManager();

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error('Error al obtener productos para renderizar:', error);
        res.status(500).send('Error al obtener productos');
    }
});

router.get('/products', async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.render('index', { products });
    } catch (error) {
        console.error('Error al obtener productos para renderizar:', error);
        res.status(500).send('Error al obtener productos');
    }
});

export default router;
