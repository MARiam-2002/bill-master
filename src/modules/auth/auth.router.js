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



// router.post("/login", isValidation(Validators.login), userController.login);


export default router;
