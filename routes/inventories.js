import express from "express";
import * as inventoryController from "../controllers/inventory-controller.js";

const router = express.Router();


router.get('/categories', inventoryController.getCategories);

// Routes for "/inventories"
router
  .route("/")
  .get(inventoryController.index) // Get all inventory items
  .post(inventoryController.add); // Add a new item

// Routes for "/inventory/:id"
router
  .route("/:id")
  .get(inventoryController.findOne) // Get a specific item by ID
  .put(inventoryController.update) // Update item by ID
  .delete(inventoryController.remove); // Delete item by ID

 

export default router;
