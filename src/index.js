import express from 'express';
import productsRouter from './routes/products.js'; 
import cartsRouter from './routes/carts.js';
import viewsRouter from './routes/views.js';  
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import expressHandlebars from 'express-handlebars';
import ProductManager from './dao/mongoDB/ProductManager.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

const hbs = expressHandlebars.create({
    layoutsDir: './src/views/layouts',
    defaultLayout: 'main',
    extname: '.handlebars',
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './src/views');

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/products', productsRouter);
app.use('/carts', cartsRouter);
app.use('/', viewsRouter);

const server = createServer(app);
const io = new Server(server);

const productManager = new ProductManager();

io.on('connection', (socket) => {
    console.log('Usuario conectado');

    productManager.getAllProducts().then(products => {
        socket.emit('actualizarLista', products);
    }).catch(error => {
        console.error('Error al obtener productos:', error);
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

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
