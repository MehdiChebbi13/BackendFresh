import Task from "../models/Task.js";
import Rapport from "../models/Rapport.js";
import Project from "../models/Project.js";
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

    const rapport = await Rapport.findById(rapportId).populate("tasks");
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
    //  Find the project by ID and push the new task to their tasks array
    const project1 = await Project.findOne({ name: project });
    if (!project1) {
      return res.status(404).json({ message: "project not found" });
    }
    project1.tasks.push(savedTask._id);
    await project1.save();

    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        message: "Name and description are required fields",
      });
    }

    let task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.name = name;
    task.description = description;

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
};

/**
 * DELETE /tasks/:id - Delete task by id.
 */
export const deleteTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rapportId } = req.query;

    const deletedTask = await Task.findById(id);
    const rapport = await Rapport.findById(rapportId);
    console.log(deletedTask, rapport);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (deletedTask.status === "En cours") {
      await Task.findByIdAndDelete(id);
      const index = rapport.tasks.findIndex((task) => task.toString() === id);
      if (index !== -1) {
        rapport.tasks.splice(index, 1);
        await rapport.save();
      }
      res.json({ message: "Task deleted successfully" });
    } else {
      deletedTask.active = false;
      await deletedTask.save();
      res.json({ message: "Task marked as inactive" });
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};
