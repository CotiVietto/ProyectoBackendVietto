import express from 'express';
import productsRouter from '../src/routes/products.js'; 
import cartsRouter from '../src/routes/carts.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import expressHandlebars from 'express-handlebars';
import ProductManager from '../dao/MongoDB/ProductManager.js'; 

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

const hbs = expressHandlebars.create({
    layoutsDir: './views/layouts',
    defaultLayout: 'main',
    extname: '.handlebars'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

const server = createServer(app);
const io = new Server(server);

const productManager = new ProductManager();

io.on('connection', (socket) => {
    console.log('Usuario conectado');

    productManager.getAllProducts().then(products => {
        socket.emit('actualizarLista', products);
    });

    socket.on('nuevoProducto', async (product) => {
        try {
            await productManager.addProduct(product);
            const updatedProducts = await productManager.getAllProducts();
            io.emit('actualizarLista', updatedProducts);
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    });

    socket.on('eliminarProducto', async (id) => {
        try {
            await productManager.deleteProduct(id);
            const updatedProducts = await productManager.getAllProducts();
            io.emit('actualizarLista', updatedProducts);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error('Error al obtener productos para renderizar:', error);
        res.status(500).send('Error al obtener productos');
    }
});

app.use(express.static('public'));

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
