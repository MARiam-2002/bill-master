import mongoose, { Schema, Types, model } from "mongoose";

const userSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

const userModel = mongoose.models.userModel || model("User", userSchema);
export default userModel;
