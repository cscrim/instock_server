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

// Add a new inventory item
// POST - http://localhost:8080/inventory
const add = async (req, res) => {
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
    const [newItemId] = await knex("inventories").insert(req.body);
    const newItem = await knex("inventories").where({ id: newItemId }).first();

    // After inserting, return the new item with the warehouse name
    const result = await knex("inventories")
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

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: `Unable to add inventory item: ${error}` });
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
        "inventories.category",
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

export { index, findOne, add, update, remove };
