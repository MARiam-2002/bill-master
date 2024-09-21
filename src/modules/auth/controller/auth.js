import bcryptjs from "bcryptjs";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import companyModel from "../../../../DB/models/company.model.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import userModel from "../../../../DB/models/user.model.js";
import tokenModel from "../../../../DB/models/token.model.js";

export const registerCompany = asyncHandler(async (req, res, next) => {
  const { CompanyName, CompanyEmail, password, CompanyPhone, CompanyAddress } =
    req.body;
  const isUser = await companyModel.findOne({ CompanyEmail });
  if (isUser) {
    return next(new Error("CompanyEmail already registered !", { cause: 409 }));
  }

  const hashPassword = bcryptjs.hashSync(
    password,
    Number(process.env.SALT_ROUND)
  );

  const company = await companyModel.create({
    CompanyName,
    CompanyEmail,
    password: hashPassword,
    CompanyPhone,
    CompanyAddress,
  });

  return res.status(200).json({
    success: true,
    message: "Company registered successfully",
  });
});

export const loginCompany = asyncHandler(async (req, res, next) => {
  const { CompanyEmail, password } = req.body;
  const company = await companyModel.findOne({ CompanyEmail });

  if (!company) {
    return next(new Error("Invalid-CompanyEmail", { cause: 400 }));
  }

  const match = bcryptjs.compareSync(password, company.password);

  if (!match) {
    return next(new Error("Invalid-Password", { cause: 400 }));
  }

  const token = jwt.sign(
    { id: company._id, CompanyEmail: company.CompanyEmail },
    process.env.TOKEN_KEY
  );

  await company.save();

  await tokenModel.create({
    token,
    company: company._id,
    agent: req.headers["user-agent"],
  });

  return res.status(200).json({ success: true, result: token });
});

export const addUser = asyncHandler(async (req, res, next) => {
  const invoiceNumber = uuidv4();
  const { phone, name } = req.body;
  const user = await userModel.create({ name, phone, invoiceNumber });
  return res.status(200).json({ success: true, result: user });
});

export const updateUser = asyncHandler(async (req, res, next) => {
  const { phone, name } = req.body;
  const user = await userModel.findByIdAndUpdate(
    req.params.id,
    { phone, name },
    { new: true }
  );
  return res.status(200).json({ success: true, result: user });
});

export const loginUser = asyncHandler(async (req, res, next) => {
  const { phone, invoiceNumber } = req.body;

  // Check if user exists
  const user = await userModel.findOne({ phone });
  if (user.isFrozen) {
    return res.status(403).json({
      message: "Your account is frozen. Please contact support.",
    });
  }
  if (!user) {
    return next(new Error("Invalid phone number", { cause: 400 }));
  }

  if (user.invoiceNumber !== invoiceNumber) {
    return next(new Error("Invalid invoice number", { cause: 400 }));
  }

  // Generate token and return success response if no errors
  const token = jwt.sign(
    { id: user._id, phone: user.phone },
    process.env.TOKEN_KEY
  );

  await tokenModel.create({
    token,
    user: user._id,
    agent: req.headers["user-agent"],
  });

  user.status = "online";
  await user.save();

  return res.status(200).json({ success: true, result: token });
});

export const freezeAccount = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { freeze } = req.body; // pass `freeze` as true or false in the body

  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  user.isFrozen = freeze;
  await user.save();

  await tokenModel.updateMany({ user: userId }, { isValid: freeze });

  return res.status(200).json({
    message: `User account has been ${action}`,
    user,
  });
});
