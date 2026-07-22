export const isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const role = req.user.role?.toUpperCase();
  if (role !== "ADMIN" && role !== "IT_ADMIN")
    return res.status(403).json({ message: "Access forbidden: Admins only" });

  next();
};
