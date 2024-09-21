import { Router } from "express";
import * as Validators from "./auth.validation.js";
import { isValidation } from "../../middleware/validation.middleware.js";
import * as companyController from "./controller/auth.js";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
const router = Router();

router.post(
  "/registerCompany",
  isValidation(Validators.registerCompanySchema),
  companyController.registerCompany
);

router.post(
  "/loginCompany",
  isValidation(Validators.loginCompany),
  companyController.loginCompany
);

router.post(
  "/addUser",
  isAuthenticated,
  isAuthorized("company"),
  isValidation(Validators.addUser),
  companyController.addUser
);

export default router;
