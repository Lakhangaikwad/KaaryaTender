import dbConnector from "./dbConnector.js";

const { Contractor } = dbConnector;

/**
 * Adds a new contractor record to the database.
 * @param {Object} contractorData - The data for the new contractor.
 * @param {string} contractorData.name - The name of the contractor (required).
 * @param {string} [contractorData.address] - The address of the contractor.
 * @param {string} [contractorData.contactNo] - The contact number of the contractor.
 * @param {string} [contractorData.document] - The file path of the document.
 * @param {string} [contractorData.originalFileName] - The original filename for display.
 * @returns {Promise<Object>} The created contractor instance.
 */
export async function addNewContractor(contractorData) {
  try {
    const newContractor = await Contractor.create(contractorData);
    return newContractor;
  } catch (error) {
    console.error("Error adding new contractor record:", error);
    throw error;
  }
}

/**
 * Updates an existing contractor record in the database.
 * @param {number} id - The ID of the contractor to update.
 * @param {Object} updateData - The data to update.
 * @param {string} [updateData.name] - The name of the contractor.
 * @param {string} [updateData.address] - The address of the contractor.
 * @param {string} [updateData.contactNo] - The contact number of the contractor.
 * @param {string} [updateData.document] - The file path of the document.
 * @param {string} [updateData.originalFileName] - The original filename for display.
 * @returns {Promise<number>} The number of affected rows.
 */
export async function updateContractor(id, updateData) {
  try {
    const [affectedRows] = await Contractor.update(updateData, { where: { id } });
    return affectedRows;
  } catch (error) {
    console.error("Error updating contractor record:", error);
    throw error;
  }
}

/**
 * Removes a contractor record from the database.
 * @param {number} id - The ID of the contractor to remove.
 * @returns {Promise<number>} The number of deleted rows.
 */
export async function removeContractor(id) {
  try {
    const deletedRows = await Contractor.destroy({ where: { id } });
    return deletedRows;
  } catch (error) {
    console.error("Error removing contractor record:", error);
    throw error;
  }
}

/**
 * Gets all contractor records from the database.
 * @returns {Promise<Array>} An array of contractor plain objects.
 */
export async function getAllContractors() {
  try {
    const contractors = await Contractor.findAll({ raw: true });
    return contractors;
  } catch (error) {
    console.error("Error getting all contractors:", error);
    throw error;
  }
}
