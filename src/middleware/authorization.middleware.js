import { asyncHandler } from "../utils/asyncHandler.js";

export const isAuthorized = (role) => {
  return asyncHandler(async (req, res, next) => {
    if (req.user) {
      if (role !== req.user.role) {
        return next(new Error("You are not authorized", { cause: 403 }));
      }
    }
    if (req.company) {
      if (role !== req.company.role) {
        return next(new Error("You are not authorized", { cause: 403 }));
      }
    }
    return next();
  });
};
