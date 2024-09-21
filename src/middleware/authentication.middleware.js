import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import companyModel from "../../DB/models/company.model.js";
import tokenModel from "../../DB/models/token.model.js";
import userModel from "../../DB/models/user.model.js";
export const isAuthenticated = asyncHandler(async (req, res, next) => {
  let token = req.headers["token"];

  if (!token) {
    return next(new Error("valid token is required"));
  }

  const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE);
  if (!decoded?.id) {
    return res.json({ message: "In-valid token payload" });
  }
  const tokenDB = await tokenModel.findOne({ token, isValid: true });

  if (!tokenDB || !tokenDB.isValid) {
    return next(new Error("Token expired!"));
  }
  const authUser = await userModel.findById(decoded.id);
  const authCompany = await companyModel.findById(decoded.id);

  if (authUser) {
    req.user = authUser;
    return next();
  }
  if (authOwner) {
    req.company = authCompany;
    return next();
  }

  if (!authUser) {
    return res.json({ message: "Not register account" });
  }
  if (!authCompany) {
    return res.json({ message: "Not register account" });
  }
});
