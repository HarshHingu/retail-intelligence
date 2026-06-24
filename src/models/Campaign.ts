import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICampaign extends Document {
  name: string;
  targetSegment: string;
  channel: string;
  offer: string;
  message: string; // fallback / combined
  whatsappMessage?: string;
  pushMessage?: string;
  expectedImpact?: string;
  goal?: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CampaignSchema = new Schema<ICampaign>(
  {
    name: { type: String, required: true },
    targetSegment: { type: String, required: true },
    channel: { type: String, required: true, default: "Multichannel" },
    offer: { type: String, required: true },
    message: { type: String, required: true },
    whatsappMessage: { type: String },
    pushMessage: { type: String },
    expectedImpact: { type: String },
    goal: { type: String },
    status: { type: String, required: true, default: "active" },
  },
  {
    timestamps: true,
    collection: "campaigns",
  }
);

const Campaign: Model<ICampaign> =
  mongoose.models.Campaign || mongoose.model<ICampaign>("Campaign", CampaignSchema, "campaigns");

export default Campaign;
