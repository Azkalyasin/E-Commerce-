import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// 🔹 Ambil cart milik user
export const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart tidak ditemukan untuk user ini" });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error getUserCart:", error);
    return res.status(500).json({ message: "Terjadi kesalahan di server" });
  }
};

// 🔹 Tambah item ke cart
export const addCartItems = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
        },
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return res.status(200).json({ message: "Berhasil menambahkan produk ke cart" });
  } catch (error) {
    console.error("Error addCartItems:", error);
    return res.status(500).json({ message: "Terjadi kesalahan di server" });
  }
};

// 🔹 Update jumlah item di cart
export const updateCartItems = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (!productId || typeof quantity !== "number") {
      return res.status(400).json({ message: "productId dan quantity harus valid" });
    }

    const cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart tidak ditemukan" });
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Item tidak ditemukan dalam cart" });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
    });

    return res.status(200).json({
      message: "Berhasil mengupdate item",
      data: updatedItem,
    });
  } catch (error) {
    console.error("Error updateCartItems:", error);
    return res.status(500).json({ message: "Terjadi kesalahan di server" });
  }
};

// 🔹 Hapus item dari cart
export const deleteCartItems = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({ message: "productId harus diisi" });
    }

    const cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart tidak ditemukan" });
    }

    const deleted = await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ message: "Item tidak ditemukan di cart" });
    }

    return res.status(200).json({ message: "Berhasil menghapus item dari cart" });
  } catch (error) {
    console.error("Error deleteCartItems:", error);
    return res.status(500).json({ message: "Terjadi kesalahan di server" });
  }
};
