const checkIfUserFrozen = (req, res, next) => {
  if (req.user.isFrozen) {
    return res.status(403).json({
      message: "Your account is frozen. Please contact support.",
    });
  }
  next();
};

export default checkIfUserFrozen;
