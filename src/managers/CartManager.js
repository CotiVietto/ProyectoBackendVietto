import fs from 'fs/promises';

class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async createCart() {
    try {
      const carts = await this.getAllCarts();
      const newCart = {
        id: carts.length ? carts[carts.length - 1].id + 1 : 1,
        products: []
      };
      carts.push(newCart);
      await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
      return newCart;
    } catch (error) {
      console.error('Error al crear el carrito:', error);
      throw new Error('Error al crear el carrito');
    }
  }

  async getAllCarts() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al leer los carritos:', error);
      throw new Error('Error al leer los carritos');
    }
  }

  async getCartById(id) {
    try {
      const carts = await this.getAllCarts();
      return carts.find(cart => cart.id === id) || null;
    } catch (error) {
      console.error('Error al obtener el carrito por ID:', error);
      throw new Error('Error al obtener el carrito');
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const carts = await this.getAllCarts();
      const cart = carts.find(cart => cart.id === cartId);
      if (cart) {
        const productIndex = cart.products.findIndex(p => p.product === productId);
        if (productIndex !== -1) {
          cart.products[productIndex].quantity += 1;
        } else {
          cart.products.push({ product: productId, quantity: 1 });
        }
        await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
        return cart;
      }
      return null;
    } catch (error) {
      console.error('Error al agregar el producto al carrito:', error);
      throw new Error('Error al agregar el producto al carrito');
    }
  }
}

export default CartManager;
