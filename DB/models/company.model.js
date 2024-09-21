import mongoose, { Schema, Types, model } from "mongoose";

const companySchema = new Schema(
  {
    CompanyName: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    CompanyEmail: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },

    password: {
      type: String,
    },
    role: {
      type: String,
      default: "company",
    },

    CompanyPhone: String,
    CompanyAddress: String,

    profileImage: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dz5dpvxg7/image/upload/v1691521498/ecommerceDefaults/user/png-clipart-user-profile-facebook-passport-miscellaneous-silhouette_aol7vc.png",
      },
      id: {
        type: String,
        default:
          "ecommerceDefaults/user/png-clipart-user-profile-facebook-passport-miscellaneous-silhouette_aol7vc",
      },
    },
  },
  { timestamps: true }
);

const companyModel =
  mongoose.models.companyModel || model("Company", companySchema);
export default companyModel;
