import jwt from "jsonwebtoken";

export const protectStaff = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    console.warn("Auth failed: Missing or invalid header");
    return res.status(401).json({ error: "Missing or invalid authorization header." });
  }

  const token = header.split(" ")[1];
  try {
    req.staff = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    console.error("Auth failed: Token verification error", error.message);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};
