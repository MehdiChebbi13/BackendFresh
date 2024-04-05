// Task model
import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    description: {
      type: String,
      required: true,
    },
    project: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Validé", "En cours", "Refusé"],
      default: "En cours",
    },
    comments: {
      type: [
        {
          text: String,
          postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", TaskSchema);
export default Task;
