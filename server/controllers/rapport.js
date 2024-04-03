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

    const user = await User.findById(userId);
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
    user.rapports.push(savedRapport);
    await user.save();

    res.status(201).json(savedRapport);
  } catch (error) {
    console.error("Error creating rapport:", error);
    res.status(500).json({ error: "Failed to create rapport" });
  }
};
/**
 * PATCH /rapports/:id - Mark a rapport as inactive.
 */
export const deleteRapport = async (req, res) => {
  try {
    const { id } = req.body;
    const updatedRapport = await Rapport.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );
    if (!updatedRapport) {
      return res.status(404).json({ message: "Rapport not found" });
    }
    res.json({ message: "Rapport marked as inactive" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * PUT /rapports/:id - Update rapport by id.
 */
// export const updateRapport = (req, res) => {
//   if (!req.body.content) {
//     return res.status(400).send({ message: "Content can not be empty" });
//   }
//   // Validate request body
//   const reportValidationErrors = validateReportInput(req.body);
//   if (reportValidationErrors.length > 0) {
//     return res.status(400).send({ message: reportValidationErrors[0] });
//   }

//   Rapport.findByIdAndUpdate(req.params.id, req.body, { new: true })
//     .then((rapport) => {
//       if (!rapport) {
//         return res.status(404).send({
//           message: "Cannot Update Rapport!",
//         });
//       }
//       res.send(rapport);
//     })
//     .catch((err) => {
//       return res.status(500).send({
//         message: "Error Updating Rapport with id " + req.params.id,
//       });
//     });
// };
