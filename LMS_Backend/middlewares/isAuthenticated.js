// import jwt from "jsonwebtoken"; 

//  const isAuthenticated = async(req, res , next) => {
//     try {
//         const token = req.cookies.token;
//         if(!token){
//             return res.status(401).json({
//                 message: "User is not Authenticated",
//                 success:false
//             })
//         }
//         const decode = await jwt.verify(token, process.env.SECRET_KEY)
//         if(!decode){
//                  return res.status(401).json({
//                 message: "invalid token",
//                 success:false
//             })
//         }
//         req.id = decode.userId;
//         next()
//     } catch (error) {
//         console.log(error)
//     }

// }

// export default isAuthenticated


import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    // 1. Get token from cookie or Authorization header
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "User is not authenticated",
        success: false,
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    // 3. Attach user ID to request
    req.id = decoded.userId;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      message: "Authentication failed",
      success: false,
    });
  }
};

export default isAuthenticated;
