// middlewares/isAdmin.js
export const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Tidak ada user terverifikasi. Silakan login." });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Akses ditolak. Hanya admin yang diizinkan." });
  }

  next(); // Lanjut ke controller berikutnya
};
