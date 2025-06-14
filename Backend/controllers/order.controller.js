
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body; // items: [{ productId, quantity }]

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No items provided." });
    }

    const productIds = items.map(i => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({ error: "Some products not found." });
    }

    let totalPrice = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) continue;

      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price
      });
    }

    const newOrder = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        items: {
          create: orderItemsData
        }
      },
      include: {
        items: true
      }
    });

    res.status(201).json({ message: "Order created", order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order." });
  }
};

// ✅ Get All Orders (admin/user)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { product: true }
        },
        user: true
      }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders." });
  }
};

// ✅ Get Order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        user: true
      }
    });
    if (!order) return res.status(404).json({ error: "Order not found." });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Error fetching order." });
  }
};

// ✅ Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.order.update({
      where: { id },
      data: { status }
    });
    res.json({ message: "Order status updated", order: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update order." });
  }
};

// ✅ Delete Order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.order.delete({ where: { id } });
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order." });
  }
};
