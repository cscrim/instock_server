import express from "express";
import warehouseRouter from "./routes/warehouse.js";

const app = express();
app.use(express.json());


// Register the route with the correct path
app.use("/warehouses", warehouseRouter);


// Start the server
app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
