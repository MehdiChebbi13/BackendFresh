import mongoose from "mongoose";

const RapportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },

    tasks: {
      type: Array,
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

const Rapport = mongoose.model("Rapport", RapportSchema);
export default Rapport;
