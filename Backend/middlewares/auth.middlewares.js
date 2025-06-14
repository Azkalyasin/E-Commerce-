import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET; // ✅ gunakan const, bukan langsung assignment global

export const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied. Token tidak ditemukan." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, secret); // ✅ pakai 'secret', bukan 'secretKey'
    req.user = verified; // ✅ menambahkan payload token ke req.user
    next(); // lanjut ke controller berikutnya
  } catch (err) {
    return res.status(400).json({ message: "Invalid Token" });
  }
};
