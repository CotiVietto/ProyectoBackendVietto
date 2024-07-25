import express from 'express';
/*import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js'; */

const app = express();

/*app.use('/products', productsRouter);
app.use('/carts', cartsRouter);*/

app.listen(8080, () => {
  console.log('Listening on port 8080');
});
