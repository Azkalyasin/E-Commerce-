import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import fs from "fs";
import path from "path";

// 🔹 Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "Products not found" });
    }
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 🔹 Get Product by ID
export const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: "Data product tidak ada" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terdapat kesalahan" });
  }
};

// 🔹 Create Product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const image = req.file;

    if (!name || !description || !price || !stock) {
      if (image) {
        fs.unlinkSync(path.join("public/uploads", image.filename));
      }
      return res.status(400).json({ message: "Inputan tidak boleh kosong" });
    }

    if (!image) {
      return res.status(400).json({ message: "imageurl tidak boleh kosong" });
    }

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock);

    if (isNaN(priceNum) || isNaN(stockNum)) {
      fs.unlinkSync(path.join("public/uploads", image.filename));
      return res.status(400).json({ message: "data harus berupa angka" });
    }

    if (priceNum <= 0) {
      fs.unlinkSync(path.join("public/uploads", image.filename));
      return res.status(400).json({ message: "price tidak boleh <= 0" });
    }

    const isExists = await prisma.product.findFirst({
      where: { name, description },
    });

    const imageUrl = "/uploads/" + image.filename;

    if (isExists) {
      fs.unlinkSync(path.join("public/uploads", image.filename));
      return res.status(409).json({ message: "Data sudah ada" });
    }

    await prisma.product.create({
      data: {
        name,
        description,
        price: priceNum,
        stock: stockNum,
        imageUrl,
        category,
      },
    });

    return res.status(201).json({ message: "Berhasil menambahkan data baru" });
  } catch (error) {
    if (req.file) {
      try {
        fs.unlinkSync(path.join("public/uploads", req.file.filename));
      } catch (err) {
        console.error("Gagal hapus gambar:", err);
      }
    }
    console.error("❌ Error saat insert product:", error);
    return res.status(500).json({ message: "terjadi kesalahan di server" });
  }
};
// 🔹 Update Product
export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, price, stock, category } = req.body;
    const image = req.file;

    if (!name || !description || !price || !stock) {
      if (image) {
        fs.unlinkSync(path.join("public/uploads", image.filename));
      }
      return res.status(400).json({ message: "Inputan tidak boleh kosong" });
    }

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock);

    if (isNaN(priceNum) || isNaN(stockNum)) {
      if (image) {
        fs.unlinkSync(path.join("public/uploads", image.filename));
      }
      return res.status(400).json({ message: "data harus berupa angka" });
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      if (image) {
        fs.unlinkSync(path.join("public/uploads", image.filename));
      }
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    // Jika ada gambar baru, hapus gambar lama
    let imageUrl = product.imageUrl;
    if (image) {
      // Hapus gambar lama
      const oldPath = path.join("public", product.imageUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }

      // Simpan path gambar baru
      imageUrl = "/uploads/" + image.filename;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: priceNum,
        stock: stockNum,
        imageUrl,
        category,
      },
    });

    return res.status(200).json({ message: "Berhasil update", product: updated });
  } catch (error) {
    if (req.file) {
      try {
        fs.unlinkSync(path.join("public/uploads", req.file.filename));
      } catch (err) {
        console.error("❌ Gagal hapus gambar baru:", err);
      }
    }
    console.error("❌ Error update product:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// 🔹 Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    // Hapus file gambar
    if (product.imageUrl) {
      const imagePath = path.join("public", product.imageUrl); // hasil: public/uploads/nama.jpg
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // hapus file secara sinkron
      }
    }

    const deleted = await prisma.product.delete({ where: { id } });

    return res.status(200).json({ message: "Berhasil dihapus", deleted });
  } catch (error) {
    console.error("❌ Error saat hapus produk:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};


export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if(!q) {
      return res.status(400).json({message: "wajib mengisi query"})
    }

    const product = await prisma.product.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        }
      }
    })

    if (product.length === 0) {
      return res.status(404).json({message: "tidak ditemukan produ"})
    }

    return res.status(200).json(product)
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan server"});
  }
};
