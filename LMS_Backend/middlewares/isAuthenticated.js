import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    let token;

    // ✅ Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "User is not authenticated",
        success: false,
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.id = decode.userId;
    next();
  } catch (error) {
    console.log("Auth error:", error);
    res.status(401).json({ message: "Invalid token", success: false });
  }
};

export default isAuthenticated;
