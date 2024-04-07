import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true, // this will add a unique index to the field in MongoDB
      lowercase: true, // this will save all emails as lower case
      trim: true, // this will remove any excess white space (both sides) of the string
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: "",
    },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    rapports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rapport" }],
    role: {
      type: String,
      enum: ["Chef", "User"],
      default: "User",
    },
    employee: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        workersReports: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Report",
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
export default User;
