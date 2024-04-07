import Project from "../models/Project.js";
import User from "../models/User.js";

/**
 * GET /projects - Get all projects.
 */
export const getProjects = async (req, res) => {
  try {
    const { userId } = req.query; // Change to req.query to get userId from query parameters
    if (!userId) {
      return res
        .status(400)
        .json({ message: "userId query parameter is required" });
    }

    const user = await User.findById(userId).populate("projects");
    if (!user) {
      return res.status(404).json({ message: "No user found with given id" });
    }

    res.json(user.projects);
  } catch (error) {
    console.error("Error fetching rapports:", error);
    res.status(500).json({ error: "Failed to fetch rapports" });
  }
};
