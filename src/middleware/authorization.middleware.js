import { asyncHandler } from "../utils/asyncHandler.js";

export const isAuthorized = (role) => {
  return asyncHandler(async (req, res, next) => {
    if (role !== req.company.role) {
      return next(new Error("You are not authorized", { cause: 403 }));
    }
    return next();
  });
};
