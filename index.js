import express from "express";
import "dotenv/config";
import cors from "cors";
import warehouseRouter from "./routes/warehouse.js";
import inventroryRouter from "./routes/inventories.js";

const { PORT, BACKEND_URL, CORS_ORIGIN } = process.env;

const app = express();

// Middleware to handle CORS and JSON data
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Register the route with the correct path
app.use("/warehouses", warehouseRouter);
app.use("/inventories", inventroryRouter);
// Start the server
app.listen(PORT, () => {
  console.log(`The server is listening on ${BACKEND_URL}:${PORT}`);
});
