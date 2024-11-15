import express from "express";
import * as inventoryController from "../controllers/inventory-controller.js";

const router = express.Router();

// Routes for "/inventories"
router
  .route("/")
  .get(inventoryController.index) // Get all inventories
  .post(inventoryController.add); // Add a new inventory

// Routes for "/inventories/:id"
router
  .route("/:id")
  .get(inventoryController.findOne) // Get a specific inventory by ID
  .put(inventoryController.update) // Update inventory by ID
  .delete(inventoryController.remove); // Delete inventory by ID

export default router;
