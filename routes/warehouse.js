import express from "express";
import * as warehouseController from "../controllers/warehouse-controller.js";

const router = express.Router();

// Routes for "/warehouses"
router
  .route("/")
  .get(warehouseController.index) // Get all warehouses
  .post(warehouseController.add); // Add a new warehouse

// Routes for "/warehouses/:id"
router
  .route("/:id")
  .get(warehouseController.findOne) // Get a specific warehouse by ID
  .put(warehouseController.update) // Update warehouse by ID
  .delete(warehouseController.remove); // Delete warehouse by ID

// New route to get inventory by warehouse
router.get("/:id/inventory", getInventoryByWarehouse);

export default router;
