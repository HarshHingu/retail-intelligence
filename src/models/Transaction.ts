import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITransaction extends Document {
  customerId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  amount: number;
  category: string;
  product: string;
  quantity: number;
  paymentMethod: string;
  purchaseDate: Date;
  storeLocation: string;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    purchaseDate: { type: Date, required: true },
    storeLocation: { type: String, required: true },
  },
  {
    collection: "transactions",
  }
);

const Transaction: Model<ITransaction> =
  mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema, "transactions");

export default Transaction;
