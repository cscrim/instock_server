import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

// Get all inventory items
// POSTMAN test - http://localhost:8080/inventory
const index = async (_req, res) => {
  try {
    const inventory = await knex("inventory");
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).send(`Error retrieving inventory items: ${error}`);
  }
};

// Get a single inventory item by ID
// POSTMAN test - http://localhost:8080/inventory/:id
const findOne = async (req, res) => {
  try {
    const item = await knex("inventory").where({ id: req.params.id }).first();

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
    const [newItemId] = await knex("inventory").insert(req.body);
    const newItem = await knex("inventory").where({ id: newItemId }).first();

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: `Unable to add inventory item: ${error}` });
  }
};

// Update an existing inventory item
// PATCH - http://localhost:8080/inventory/:id
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
    const rowsUpdated = await knex("inventory")
      .where({ id: req.params.id })
      .update(req.body);

    if (rowsUpdated === 0) {
      return res
        .status(404)
        .json({ message: `Inventory item with ID ${req.params.id} not found` });
    }

    const updatedItem = await knex("inventory")
      .where({ id: req.params.id })
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
    const rowsDeleted = await knex("inventory")
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
