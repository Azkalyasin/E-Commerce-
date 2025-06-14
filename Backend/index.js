import express from 'express';
import cors from 'cors';
const PORT = process.env.PORT || 5000;
import productRoutes from "./routes/productRoutes.js";
import userRouters from "./routes/userRouters.js"
import cartRouters from "./routes/cartRoutes.js"
import orderRouters from "./routes/orderRoutes.js"


const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.use("/api/products", productRoutes);
app.use("/api/users", userRouters);        
app.use("/api/cart", cartRouters); 
app.use("/api/order", orderRouters)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

