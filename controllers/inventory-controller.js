import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

// Get all inventories
// GET - http://localhost:8080/inventories
const index = async (_req, res) => {
  try {
    const inventories = await knex("inventories");
    res.status(200).json(inventories);
  } catch (error) {
    res.status(500).send(`Error retrieving inventories: ${error}`);
  }
};

// Get a single inventory by ID
// GET - http://localhost:8080/inventories/:id
const findOne = async (req, res) => {
  try {
    const inventory = await knex("inventories")
      .where({ id: req.params.id })
      .first();

    if (!inventory) {
      return res
        .status(404)
        .json({ message: `Inventory with ID ${req.params.id} not found` });
    }

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: `Unable to retrieve inventory: ${error}` });
  }
};

// Add a new inventory
// POST - http://localhost:8080/inventories
const add = async (req, res) => {
  const {
    inventory_name,
    warehouse_id, // Assuming the inventory belongs to a warehouse
    quantity,
    price,
    description,
    sku,
  } = req.body;

  if (!inventory_name || !warehouse_id || !quantity || !price) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  try {
    const [newInventoryId] = await knex("inventories").insert(req.body);
    const newInventory = await knex("inventories")
      .where({ id: newInventoryId })
      .first();

    res.status(201).json(newInventory);
  } catch (error) {
    res.status(500).json({ message: `Unable to add inventory: ${error}` });
  }
};

// Update an existing inventory
// PATCH - http://localhost:8080/inventories/:id
const update = async (req, res) => {
  const { id } = req.params; // Get inventory ID from URL params
  const { inventory_name, warehouse_id, quantity, price, description, sku } =
    req.body;

  // Remove 'updated_at' from the request body to avoid the invalid format issue
  const { updated_at, ...updatedData } = req.body;

  try {
    // Perform the update (no need to manually manage 'updated_at')
    const rowsUpdated = await knex("inventories")
      .where({ id })
      .update(updatedData);

    // If no rows were updated, return a 404 not found error
    if (rowsUpdated === 0) {
      return res.status(404).json({
        message: `Inventory with ID ${id} not found`,
      });
    }

    // Fetch the updated inventory data and return it
    const updatedInventory = await knex("inventories").where({ id }).first();
    res.status(200).json(updatedInventory); // Send back the updated inventory details
  } catch (error) {
    res.status(500).json({
      message: `Unable to update inventory: ${error}`,
    });
  }
};

// Delete an inventory
// DELETE - http://localhost:8080/inventories/:id
const remove = async (req, res) => {
  try {
    const rowsDeleted = await knex("inventories")
      .where({ id: req.params.id })
      .delete();

    if (rowsDeleted === 0) {
      return res
        .status(404)
        .json({ message: `Inventory with ID ${req.params.id} not found` });
    }

    res.sendStatus(204); // No Content
  } catch (error) {
    res.status(500).json({ message: `Unable to delete inventory: ${error}` });
  }
};

export { index, findOne, add, update, remove };
