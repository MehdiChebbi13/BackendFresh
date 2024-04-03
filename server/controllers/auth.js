import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// REGISTER USER
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists in the database by checking their email address
    let existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(409).json("Email is already in use.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with hashed password and save it to the database
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGGING IN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json("Invalid email ");
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(401).json("Invalid password");
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).send({ token, user });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};
