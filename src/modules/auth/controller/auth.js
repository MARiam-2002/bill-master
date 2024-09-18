import bcryptjs from "bcryptjs";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import companyModel from "../../../../DB/models/company.model.js";

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

// export const login = asyncHandler(async (req, res, next) => {
//   const { email, password } = req.body;
//   const user = await userModel.findOne({ email });

//   if (!user) {
//     return next(new Error("Invalid-Email", { cause: 400 }));
//   }

//   if (!user.isConfirmed) {
//     return next(new Error("Un activated Account", { cause: 400 }));
//   }

//   const match = bcryptjs.compareSync(password, user.password);

//   if (!match) {
//     return next(new Error("Invalid-Password", { cause: 400 }));
//   }

//   const token = jwt.sign(
//     { id: user._id, email: user.email },
//     process.env.TOKEN_KEY,
//     { expiresIn: "2d" }
//   );

//   await tokenModel.create({
//     token,
//     user: user._id,
//     agent: req.headers["user-agent"],
//   });

//   user.status = "online";
//   await user.save();

//   return res.status(200).json({ success: true, result: token });
// });
