import bcryptjs from "bcryptjs";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import companyModel from "../../../../DB/models/company.model.js";
import jwt from "jsonwebtoken";

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

  return res.status(200).json({ success: true, result: token });
});
