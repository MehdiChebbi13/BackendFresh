import Task from "../models/Task.js";
import Rapport from "../models/Rapport.js";

/**
 * GET /tasks - Get all tasks.
 */
export const getTasks = async (req, res) => {
  try {
    const { rapportId } = req.query;

    if (!rapportId) {
      return res
        .status(400)
        .json({ message: "rapportId query parameter is required" });
    }

    const rapport = await Rapport.findById(rapportId);
    if (!rapport) {
      return res.status(404).json({ message: "rapport not found" });
    }

    res.json(rapport.tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

/**
 * POST /tasks - Create a new task.
 */
export const createTask = async (req, res) => {
  try {
    const { name, description, project, rapportId } = req.body;

    if (!name || !description || !project || !rapportId) {
      return res.status(400).json({
        message:
          "Name, description, project, and rapportId are required fields",
      });
    }

    // Create a new task
    const newTask = new Task({ name, description, project });
    const savedTask = await newTask.save();

    // Find the rapport by ID and push the new task to their tasks array
    const rapport = await Rapport.findById(rapportId);
    if (!rapport) {
      return res.status(404).json({ message: "Rapport not found" });
    }
    rapport.tasks.push(savedTask._id);
    await rapport.save();

    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

/**
 * DELETE /tasks/:id - Delete task by id.
 */
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task marked as inactive" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};
