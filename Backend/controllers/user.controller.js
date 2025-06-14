import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Inputan data tidak boleh kosong" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(409).json({ message: "Email sudah digunakan" });
    }

    const register = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        role: "user",
      },
    });

    return res.status(201).json({ message: "Berhasil mendaftar" });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "terdapat kesalah pada server" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Inputan data tidak boleh kosong" });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "tidak ada user dengan data ini" });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({ message: "password salah" });
    }

    const token = jwt.sign({ id: user.id, email: user.email,role: user.role}, secret, { expiresIn: "7h" });
    res.status(200).json({ message: "Login berhasil", token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({message: "terjadi kesalahan pada server"});
  }
};
