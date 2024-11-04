import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  // Determine the token expiration time based on the user role
  const expiresIn = user.role === "admin" ? "2h" : "24h"; // 2 hours for admins, 24 hours for users

  return jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      isBlocked: user.isBlocked,
      isAccountVerified: user.isAccountVerified,
      role: user.role,
    },
    process.env.JWT_SECRET || "somethingsecret",
    {
      expiresIn,
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(
      token,
      process.env.JWT_SECRET || "somethingsecret",
      (err, decode) => {
        if (err) {
          return res
            .status(401)
            .send({ message: "Unauthorized: Invalid or expired token" });
        } else {
          req.user = decode;
          next();
        }
      }
    );
  } else {
    return res.status(401).send({ message: "Unauthorized: No token provided" });
  }
};

export const isAdmin = (req, res, next) => {
  // Check if the user's role is "admin"
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res
      .status(403)
      .send({ message: "Forbidden: You do not have admin privileges" });
  }
};
