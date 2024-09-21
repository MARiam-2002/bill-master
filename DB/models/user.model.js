import mongoose, { Schema, Types, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: {
      type: String,
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    status: {
      type: String,
      default: "offline",
    },
    isFrozen: {
      // New field for freezing the account
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.models.userModel || model("User", userSchema);
export default userModel;
