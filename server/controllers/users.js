import User from "../models/User.js";

// READ
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ msg: "No user found" });
    }
    const data = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    }; // Corrected data object
    res.status(200).json(data);
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
export const getUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ msg: "No user found" });
    } else if (user.role === "chef") {
      const allUsers = await User.find({}, "name");
      res.status(200).json(allUsers.map((user) => user.name));
    } else {
      return res
        .status(403)
        .json({ msg: "You are not authorized to access this information" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
