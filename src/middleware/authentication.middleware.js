import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import companyModel from "../../DB/models/company.model.js";
export const isAuthenticated = asyncHandler(async (req, res, next) => {
  let token = req.headers["token"];

  if (!token) {
    return next(new Error("valid token is required"));
  }

  const decode = jwt.verify(token, process.env.TOKEN_KEY);
  if (!decode) {
    return next(new Error("Invalid-token"));
  }



  const company = await companyModel.findOne({ CompanyEmail: decode.CompanyEmail });

  if (!company) {
    return next(new Error("user not found!"));
  }

  req.company = company;
  return next();
});
