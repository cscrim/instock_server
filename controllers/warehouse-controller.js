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

  // Validate required fields
  if (
    !warehouse_name ||
    !address ||
    !city ||
    !country ||
    !contact_name ||
    !contact_position ||
    !contact_phone ||
    !contact_email
  ) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  // Validate phone number and email formats
  const phoneRegex =
    /^\+?(\d{1,3})?[-.\s]?(\(\d{1,3}\)|\d{1,3})[-.\s]?\d{3}[-.\s]?\d{4}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!phoneRegex.test(contact_phone)) {
    return res.status(400).json({ message: "Invalid phone number format" });
  }
  if (!emailRegex.test(contact_email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const rowsUpdated = await knex("warehouses")
      .where({ id: req.params.id })
      .update(req.body);

    if (rowsUpdated === 0) {
      return res
        .status(404)
        .json({ message: `Warehouse with ID ${req.params.id} not found` });
    }

    const updatedWarehouse = await knex("warehouses")
      .where({ id: req.params.id })
      .first();
    res.status(200).json(updatedWarehouse);
  } catch (error) {
    res.status(500).json({ message: `Unable to update warehouse: ${error}` });
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