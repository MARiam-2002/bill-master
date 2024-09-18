import { Router } from "express";
import * as Validators from "./auth.validation.js";
import { isValidation } from "../../middleware/validation.middleware.js";
import * as companyController from "./controller/auth.js";
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

export default router;
