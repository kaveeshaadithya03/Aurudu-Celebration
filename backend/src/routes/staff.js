import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  if (email !== process.env.STAFF_EMAIL || password !== process.env.STAFF_PASSWORD) {
    return res.status(401).json({ error: "Invalid staff credentials." });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });

  return res.json({ token });
});

export default router;
