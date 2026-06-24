import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  email: string;
  phone: string;
  totalSpend: number;
  totalOrders: number;
  lastPurchaseDate: Date;
  firstPurchaseDate: Date;
  segment: string;
  preferredCategory: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    totalSpend: { type: Number, required: true, default: 0 },
    totalOrders: { type: Number, required: true, default: 0 },
    lastPurchaseDate: { type: Date, required: true },
    firstPurchaseDate: { type: Date, required: true },
    segment: { type: String, required: true },
    preferredCategory: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "customers",
  }
);

// Prevent compiling model multiple times
const Customer: Model<ICustomer> =
  mongoose.models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema, "customers");

export default Customer;
