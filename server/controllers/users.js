import User from "../models/User.js";

// READ
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ msg: "No user found" });
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// // UPDATE
// export const modifyUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findById(id);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };
