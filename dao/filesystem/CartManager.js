import fs from 'fs/promises';
import path from 'path';

// Construye la ruta del archivo de forma dinámica
const cartsFilePath = path.resolve('src', 'data', 'carts.json');

class CartManager {
  async getAllCarts() {
    try {
      // Verifica si el archivo existe antes de leer
      await fs.access(cartsFilePath);
      const data = await fs.readFile(cartsFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe, crea uno vacío
      if (error.code === 'ENOENT') {
        await fs.writeFile(cartsFilePath, JSON.stringify([]));
        return [];
      }
      console.error('Error al leer los carritos:', error);
      throw new Error('Error al leer los carritos');
    }
  }

  async createCart(cart) {
    try {
      const carts = await this.getAllCarts();
      carts.push(cart);
      await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
      return cart;
    } catch (error) {
      console.error('Error al crear el carrito:', error);
      throw new Error('Error al crear el carrito');
    }
  }
}

export default CartManager;

