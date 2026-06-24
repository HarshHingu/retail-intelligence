import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  category: string;
  price: number;
  totalSold: number;
  stock: number;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    totalSold: { type: Number, required: true, default: 0 },
    stock: { type: Number, required: true, default: 0 },
  },
  {
    collection: "products",
  }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema, "products");

export default Product;
