import express from 'express';
import ProductManager from '../dao/mongoDB/ProductManager.js';

const router = express.Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = {};
    if (query) {
      filter.title = new RegExp(query, 'i'); 
    }

    const sortOption = {};
    if (sort === 'asc') sortOption.price = 1;
    else if (sort === 'desc') sortOption.price = -1;

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sortOption,
      lean: true 
    };

    const result = await productManager.getProducts(filter, options);

    const prevLink = result.hasPrevPage ? `/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null;
    const nextLink = result.hasNextPage ? `/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null;

    res.render('index', {
      products: result.docs,
      totalPages: result.totalPages,
      prevPage: result.hasPrevPage ? result.prevPage : null,
      nextPage: result.hasNextPage ? result.nextPage : null,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink
    });
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

router.get('/:id', async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.id);
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }
    res.json(product);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).send('Error al obtener el producto');
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await productManager.updateProduct(req.params.id, req.body);
    if (!updatedProduct) {
      return res.status(404).send('Producto no encontrado');
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).send('Error al actualizar el producto');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await productManager.deleteProduct(req.params.id);
    if (!result.deleted) {
      return res.status(404).send('Producto no encontrado');
    }
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).send('Error al eliminar el producto');
  }
});

export default router;
