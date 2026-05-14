export const role = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(403).json({ message: "Brak uprawnień" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Nie masz dostępu do tego zasobu",
      });
    }

    next();
  };
};
