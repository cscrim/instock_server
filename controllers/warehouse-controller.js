import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

// Get all warehouses
//postman test done - http://localhost:8080/warehouses
const index = async (_req, res) => {
  try {
    const warehouses = await knex("warehouses");
    res.status(200).json(warehouses);
  } catch (error) {
    res.status(500).send(`Error retrieving warehouses: ${error}`);
  }
};

// Get a single warehouse by ID
//http://localhost:8080/warehouses/:id --done
const findOne = async (req, res) => {
  try {
    const warehouse = await knex("warehouses")
      .where({ id: req.params.id })
      .first();

    if (!warehouse) {
      return res
        .status(404)
        .json({ message: `Warehouse with ID ${req.params.id} not found` });
    }

    res.status(200).json(warehouse);
  } catch (error) {
    res.status(500).json({ message: `Unable to retrieve warehouse: ${error}` });
  }
};

// Add a new warehouse
//POST - http://localhost:8080/warehouses

const add = async (req, res) => {
  //destructured
  const {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  } = req.body;

  if (!warehouse_name || !address || !city || !contact_name || !contact_email) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  try {
    const [newWarehouseId] = await knex("warehouses").insert(req.body);
    const newWarehouse = await knex("warehouses")
      .where({ id: newWarehouseId })
      .first();

    res.status(201).json(newWarehouse);
  } catch (error) {
    res.status(500).json({ message: `Unable to add warehouse: ${error}` });
  }
};

// Update an existing warehouse
//http://localhost:8080/warehouses/:id PATCH
const update = async (req, res) => {
  const { id } = req.params; // Get warehouse ID from URL params
  const {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  } = req.body;

  // Remove 'updated_at' from the request body to avoid the invalid format issue
  const { updated_at, ...updatedData } = req.body;

  try {
    // Perform the update (no need to manually manage 'updated_at')
    const rowsUpdated = await knex("warehouses")
      .where({ id })
      .update(updatedData);

    // If no rows were updated, return a 404 not found error
    if (rowsUpdated === 0) {
      return res.status(404).json({
        message: `Warehouse with ID ${id} not found`,
      });
    }

    // Fetch the updated warehouse data and return it
    const updatedWarehouse = await knex("warehouses").where({ id }).first();
    res.status(200).json(updatedWarehouse); // Send back the updated warehouse details
  } catch (error) {
    res.status(500).json({
      message: `Unable to update warehouse: ${error}`, // Handle and return any errors
    });
  }
};

// Delete a warehouse
//http://localhost:8080/warehouses/1
const remove = async (req, res) => {
  try {
    const rowsDeleted = await knex("warehouses")
      .where({ id: req.params.id })
      .delete();

    if (rowsDeleted === 0) {
      return res
        .status(404)
        .json({ message: `Warehouse with ID ${req.params.id} not found` });
    }

    res.sendStatus(204); // No Content
  } catch (error) {
    res.status(500).json({ message: `Unable to delete warehouse: ${error}` });
  }
};

export { index, findOne, add, update, remove };
