import fs from 'fs/promises';

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async getAllProducts() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading products file:', error);
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getAllProducts();
    return products.find(product => product.id === id);
  }

  generateUniqueId(products) {
    let maxId = products.reduce((max, product) => Math.max(max, product.id), 0);
    return maxId + 1;
  }

  async addProduct(product) {
    const products = await this.getAllProducts();
    product.id = this.generateUniqueId(products);
    if (!this.isValidProduct(product)) {
      throw new Error('Invalid product data');
    }
    products.push(product);
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    return product;
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
      Array.isArray(product.thumbnails)
    );
  }

  async updateProduct(id, productData) {
    const products = await this.getAllProducts();
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...productData };
      await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
      return products[index];
    }
    return null;
  }

  async deleteProduct(id) {
    const products = await this.getAllProducts();
    const newProducts = products.filter(product => product.id !== id);
    if (newProducts.length < products.length) {
      await fs.writeFile(this.filePath, JSON.stringify(newProducts, null, 2));
      return { deleted: true };
    }
    return { deleted: false };
  }
}

export default ProductManager;
