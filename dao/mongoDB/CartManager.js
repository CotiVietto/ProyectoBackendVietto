import Product from '../../dao/models/Product.js';

class ProductManager {
  async getAllProducts() {
    try {
      return await Product.find();
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      return [];
    }
  }

  async getProductById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      console.error('Error al obtener el producto por ID:', error);
      return null;
    }
  }

  async addProduct(product) {
    try {
      if (!this.isValidProduct(product)) {
        throw new Error('Datos del producto inválidos');
      }
      const newProduct = new Product(product);
      return await newProduct.save();
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      throw new Error('Error al agregar el producto');
    }
  }

  isValidProduct(product) {
    return (
      typeof product.title === 'string' &&
      typeof product.description === 'string' &&
      typeof product.code === 'string' &&
      typeof product.price === 'number' &&
      typeof product.status === 'boolean' &&
      typeof product.stock === 'number' &&
      typeof product.category === 'string' &&
      (Array.isArray(product.thumbnails) || product.thumbnails === undefined)
    );
  }

  async updateProduct(id, productData) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });
      return updatedProduct;
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      return null;
    }
  }

  async deleteProduct(id) {
    try {
      const result = await Product.findByIdAndDelete(id);
      return { deleted: !!result };
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      return { deleted: false };
    }
  }
}

export default ProductManager;
