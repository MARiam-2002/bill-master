import joi from "joi";

export const registerCompanySchema = joi
  .object({
    CompanyName: joi.string().min(3).max(20).required(),
    CompanyEmail: joi.string().email().required(),
    CompanyPhone: joi.string().required(),
    CompanyAddress: joi.string().required(),

    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();

// export const login = joi
//   .object({
//     email: joi.string().email().required(),
//     password: joi.string().required(),
//   })
//   .required();
