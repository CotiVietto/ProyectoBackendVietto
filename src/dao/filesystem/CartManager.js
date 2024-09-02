import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

class CartManager {
  async createCart() {
    return await Cart.create({ products: [] });
  }

  async getAllCarts() {
    return await Cart.find().populate('products.product'); 
  }

  async getCartById(cartId) {
    return await Cart.findById(cartId).populate('products.product');
  }

  async updateCart(cartId, products) {
    return await Cart.findByIdAndUpdate(cartId, { products }, { new: true }).populate('products.product');
  }

  async clearCart(cartId) {
    return await Cart.findByIdAndUpdate(cartId, { products: [] }, { new: true }).populate('products.product');
  }

  async deleteProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (cart) {
      cart.products = cart.products.filter(p => p.product.toString() !== productId);
      return await cart.save().populate('products.product');
    }
    return null;
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    if (cart) {
      const product = cart.products.find(p => p.product.toString() === productId);
      if (product) {
        product.quantity = quantity;
        return await cart.save().populate('products.product');
      }
    }
    return null;
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
  
      const productIndex = cart.products.findIndex(item => item.product.toString() === productId.toString());
  
      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
  
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error al agregar producto al carrito: ${error.message}`);
    }
    
}
}


export default CartManager;
