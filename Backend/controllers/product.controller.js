import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
    const { name, description, price, stock, imageUrl, category } = req.body;

    if (!name || !description || !price || !stock) {
      return res.status(400).json({ message: "Inputan tidak boleh kosong" });
    }

    if (typeof price !== "number" || typeof stock !== "number") {
      return res.status(400).json({ message: "data harus berupa angka" });
    }

    const isExists = await prisma.product.findFirst({
      where: { name, description },
    });

    if (isExists) {
      return res.status(409).json({ message: "Data sudah ada" });
    }

    await prisma.product.create({
      data: { name, description, price, stock, imageUrl, category },
    });

    return res.status(201).json({ message: "Berhasil menambahkan data baru" });
  } catch (error) {
    console.error("❌ Error saat insert product:", error);
    return res.status(500).json({ message: "terjadi kesalahan di server" });
  }
};

// 🔹 Update Product
export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, price, stock, imageUrl, category } = req.body;

    if (!name || !description || !price || !stock) {
      return res.status(400).json({ message: "Inputan tidak boleh kosong" });
    }

    if (typeof price !== "number" || typeof stock !== "number") {
      return res.status(400).json({ message: "data harus berupa angka" });
    }

    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { name, description, price, stock, imageUrl, category },
    });

    return res.status(200).json({ message: "Berhasil update", product: updated });
  } catch (error) {
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

    const deleted = await prisma.product.delete({ where: { id } });

    return res.status(200).json({ message: "Berhasil dihapus", deleted });
  } catch (error) {
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
