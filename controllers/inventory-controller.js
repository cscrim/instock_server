import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

// Get all inventory items with warehouse names
// POSTMAN test - http://localhost:8080/inventory
const index = async (_req, res) => {
  try {
    const inventory = await knex("inventories")
      .join("warehouses", "inventories.warehouse_id", "=", "warehouses.id") // Join with the warehouses table
      .select(
        "inventories.id",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity",
        "inventories.created_at",
        "inventories.updated_at",
        "warehouses.warehouse_name" // Select the warehouse name as well
      );

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).send(`Error retrieving inventory items: ${error}`);
  }
};

// Get a single inventory item by ID with the corresponding warehouse name
// POSTMAN test - http://localhost:8080/inventory/:id
const findOne = async (req, res) => {
  try {
    const item = await knex("inventories")
      .join("warehouses", "inventories.warehouse_id", "=", "warehouses.id") // Join with the warehouses table
      .where({ "inventories.id": req.params.id }) // Match by inventory ID
      .select(
        "inventories.id",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity",
        "inventories.created_at",
        "inventories.updated_at",
        "warehouses.warehouse_name" // Select warehouse name
      )
      .first(); // Fetch only the first (or only) item, since we are querying by ID

    if (!item) {
      return res
        .status(404)
        .json({ message: `Inventory item with ID ${req.params.id} not found` });
    }

    res.status(200).json(item);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Unable to retrieve inventory item: ${error}` });
  }
};

// // Add a new inventory item
// // POST - http://localhost:8080/inventory
const add = async (req, res) => {
  const { item_name, description, category, status, quantity, warehouse_id } =
    req.body;

  // Validate required fields
  if (
    !item_name ||
    !description ||
    !category ||
    !status ||
    warehouse_id === undefined
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Validate status and quantity logic
  if (status === "In Stock" && (quantity === undefined || quantity < 0)) {
    return res.status(400).json({
      message: "Quantity must be a non-negative number for 'In Stock' items.",
    });
  }
  if (status === "Out of Stock" && quantity !== 0) {
    return res
      .status(400)
      .json({ message: "Quantity must be 0 for 'Out of Stock' items." });
  }

  try {
    // Insert new inventory item
    const [newItemId] = await knex("inventories").insert({
      item_name,
      description,
      category,
      status,
      quantity,
      warehouse_id,
    });

    // Fetch the newly created item along with its warehouse name
    const newItem = await knex("inventories")
      .join("warehouses", "inventories.warehouse_id", "=", "warehouses.id")
      .where({ "inventories.id": newItemId })
      .select(
        "inventories.id",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity",
        "inventories.created_at",
        "inventories.updated_at",
        "warehouses.warehouse_name"
      )
      .first();

    res.status(201).json(newItem);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Unable to add inventory item: ${error.message}` });
  }
};

// Update an existing inventory item
// PUT - http://localhost:8080/inventory/:id
const update = async (req, res) => {
  const { item_name, category, status, quantity, warehouse_id } = req.body;

  if (
    !item_name ||
    !category ||
    !status ||
    quantity === undefined ||
    !warehouse_id
  ) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  try {
    const rowsUpdated = await knex("inventories")
      .where({ id: req.params.id })
      .update(req.body);

    if (rowsUpdated === 0) {
      return res
        .status(404)
        .json({ message: `Inventory item with ID ${req.params.id} not found` });
    }

    const updatedItem = await knex("inventories")
      .join("warehouses", "inventories.warehouse_id", "=", "warehouses.id")
      .where({ "inventories.id": req.params.id })
      .select(
        "inventories.id",
        "inventories.item_name",
        "inventories.description",
        "categories.name as category",
        "inventories.status",
        "inventories.quantity",
        "inventories.created_at",
        "inventories.updated_at",
        "warehouses.warehouse_name"
      )
      .first();

    res.status(200).json(updatedItem);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Unable to update inventory item: ${error}` });
  }
};

// Delete an inventory item
// DELETE - http://localhost:8080/inventory/:id
const remove = async (req, res) => {
  try {
    const rowsDeleted = await knex("inventories")
      .where({ id: req.params.id })
      .delete();

    if (rowsDeleted === 0) {
      return res
        .status(404)
        .json({ message: `Inventory item with ID ${req.params.id} not found` });
    }

    res.sendStatus(204); // No Content
  } catch (error) {
    res
      .status(500)
      .json({ message: `Unable to delete inventory item: ${error}` });
  }
};

const getCategories = async (_req, res) => {
  try {
    // Fetch distinct categories from the 'inventories' table
    const categories = await knex("inventories")
      .distinct("category") // Get distinct categories
      .whereNotNull("category"); // Exclude rows with null categories

    res.status(200).json(categories); // Return categories as JSON
  } catch (error) {
    res.status(500).send(`Error retrieving categories: ${error}`);
  }
};

export { index, findOne, add, update, remove, getCategories };
