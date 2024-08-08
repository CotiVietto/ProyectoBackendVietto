import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, default: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnails: { type: [String], default: [] } 
});

const Product = mongoose.model('Product', productSchema);

export default Product;
