import Rapport from "../models/Rapport.js";
import User from "../models/User.js";
/**
 * GET /rapports - Get all rapports.
 */
export const getRapports = async (req, res) => {
  try {
    const { userId } = req.query; // Change to req.query to get userId from query parameters
    if (!userId) {
      return res
        .status(400)
        .json({ message: "userId query parameter is required" });
    }

    const user = await User.findById(userId).populate("rapports");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const allRapports = user.rapports;
    res.json(allRapports);
  } catch (error) {
    console.error("Error fetching rapports:", error);
    res.status(500).json({ error: "Failed to fetch rapports" });
  }
};

/**
 * POST /rapports - Create a new rapport.
 */
export const createRapport = async (req, res) => {
  try {
    const { name, userId } = req.body;

    if (!name || !userId) {
      return res
        .status(400)
        .json({ message: "Name and userId are required fields" });
    }

    // Create a new rapport
    const newRapport = new Rapport({ name });
    const savedRapport = await newRapport.save();
    // Find the user by ID and push the new rapport to their rapports array
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.rapports.push(savedRapport._id);
    await user.save();

    res.status(201).json(savedRapport);
  } catch (error) {
    console.error("Error creating rapport:", error);
    res.status(500).json({ error: "Failed to create rapport" });
  }
};
/**
 * DELETE /rapports/:id - Mark a rapport as inactive.
 */
export const deleteRapport = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    // Find the rapport by ID
    const rapport = await Rapport.findById(id);
    if (!rapport) {
      return res.status(404).json({ message: "Rapport not found" });
    }

    if (rapport.tasks.length === 0) {
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove the rapport from the user's rapports array
      const index = user.rapports.findIndex((rap) => rap.toString() === id);
      if (index !== -1) {
        user.rapports.splice(index, 1);
        await user.save(); // Save the updated user document
      }

      // Delete the rapport from the Rapport collection
      await Rapport.findByIdAndDelete(id);
      return res.json({ message: "Rapport deleted" });
    }

    // If the rapport has tasks, mark it as inactive
    const updatedRapport = await Rapport.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );
    res.json({ message: "Rapport marked as inactive" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * PUT /rapports/:id - Update rapport by id.
 */
export const updateRapport = async (req, res) => {
  try {
    // Check if content is empty
    if (!req.body.name) {
      return res.status(400).send({ message: "Name cannot be empty" });
    }

    // Update Rapport
    const updatedRapport = await Rapport.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    if (!updatedRapport) {
      console.log(req.body.name);
      return res.status(404).send({ message: "Cannot update Rapport!" });
    }

    res.send(updatedRapport);
  } catch (err) {
    console.error("Error updating Rapport:", err);
    return res
      .status(500)
      .send({ message: "Error updating Rapport with ID " + req.params.id });
  }
};
