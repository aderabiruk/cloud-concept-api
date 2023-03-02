import mongoose, { Schema } from "mongoose";

const SettingsSchema = new Schema(
  {
    accountId: {
      type: String,
      required: true
    },
    templatePath: {
      type: String,
      required: true
    },
  },
  { 
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    }
  }
);

export const Settings = mongoose.model("Settings", SettingsSchema);
