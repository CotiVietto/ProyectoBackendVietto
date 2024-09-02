import Cart from '../models/Cart.js';

class CartManager {
  async getAllCarts() {
    try {
      return await Cart.find().populate('products.product').exec();
    } catch (error) {
      console.error('Error al obtener los carritos:', error);
      return [];
    }
  }

  async getCartById(id) {
    try {
      return await Cart.findById(id).populate('products.product').exec();
    } catch (error) {
      console.error('Error al obtener el carrito por ID:', error);
      return null;
    }
  }

  async createCart() {
    try {
      const cart = new Cart(); // Si no necesitas datos, simplemente inicializa sin parámetros
      return await cart.save();
    } catch (error) {
      console.error('Error al crear el carrito:', error);
      throw new Error('Error al crear el carrito');
    }
  }
  

  async updateCart(cartId, products) {
    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        cartId,
        { products },
        { new: true }
      ).populate('products.product').exec();
      return updatedCart;
    } catch (error) {
      console.error('Error al actualizar el carrito:', error);
      return null;
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const updatedCart = await Cart.findOneAndUpdate(
        { _id: cartId, 'products.product': productId },
        { $set: { 'products.$.quantity': quantity } },
        { new: true }
      ).populate('products.product').exec();
      return updatedCart;
    } catch (error) {
      console.error('Error al actualizar la cantidad del producto en el carrito:', error);
      return null;
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        cartId,
        { $pull: { products: { product: productId } } },
        { new: true }
      ).populate('products.product').exec();
      return updatedCart;
    } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error);
      return null;
    }
  }

  async clearCart(cartId) {
    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        cartId,
        { products: [] },
        { new: true }
      ).exec();
      return updatedCart;
    } catch (error) {
      console.error('Error al limpiar el carrito:', error);
      return null;
    }
  }

  async deleteCart(cartId) {
    try {
      const result = await Cart.findByIdAndDelete(cartId).exec();
      return { deleted: !!result };
    } catch (error) {
      console.error('Error al eliminar el carrito:', error);
      return { deleted: false };
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
      if (productIndex === -1) {
        cart.products.push({ product: productId, quantity });
      } else {
        cart.products[productIndex].quantity += quantity;
      }

      return await cart.save();
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      throw error;
    }
  }
}

export default CartManager;
