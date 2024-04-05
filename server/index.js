import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import rapportRoutes from "./routes/rapports.js";
import taskRoutes from "./routes/task.js";
import userRoutes from "./routes/users.js";
import Project from "./models/Project.js";
import User from "./models/User.js";
//  Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // enable CORS
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// File Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// ROUTES WITH  FILE UPLOADS
app.post("/auth/register", upload.single("picture"), register);

// ROUTES
app.use("/auth", authRoutes);
app.use("/profile", userRoutes);
app.use("/home", rapportRoutes);
app.use("/home", taskRoutes);

// for adding projects
// app.post("/projects", async (req, res) => {
//   try {
//     const { name, startDate, deadline } = req.body;

//     const newProject = new Project({
//       name,
//       startDate,
//       deadline,
//     });

//     // Save the project to the database
//     await newProject.save();

//     // Fetch all users
//     const users = await User.find();

//     // Update projects array for each user
//     await Promise.all(
//       users.map(async (user) => {
//         user.projects.push(newProject._id); // Assuming projects array stores project ids
//         await user.save();
//       })
//     );

//     res
//       .status(201)
//       .json({ message: "Project created successfully", project: newProject });
//   } catch (error) {
//     console.error("Error creating project:", error);
//     res.status(500).json({ error: "Failed to create project" });
//   }
// });

// MONGOOSE SETUP
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
