import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access denied. No token provided.");
    }
    if (token.startsWith("Bearer ")) {
      // Remove Bearer from the header string
      token = token.slice(7, token.length).trimLeft();
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log(verified);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
};
export default verifyToken;
