import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAIInsight extends Document {
  summary: string;
  recommendations: string[];
  churnRiskCustomers: number;
  generatedAt: Date;
}

const AIInsightSchema = new Schema<IAIInsight>(
  {
    summary: { type: String, required: true },
    recommendations: [{ type: String, required: true }],
    churnRiskCustomers: { type: Number, required: true, default: 0 },
    generatedAt: { type: Date, required: true, default: Date.now },
  },
  {
    collection: "aiInsights",
  }
);

const AIInsight: Model<IAIInsight> =
  mongoose.models.AIInsight || mongoose.model<IAIInsight>("AIInsight", AIInsightSchema, "aiInsights");

export default AIInsight;
