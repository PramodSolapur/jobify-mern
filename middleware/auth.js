import { UnauthenticatedError } from "../errors/index.js";
import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authnetication Invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(payload);
    // attach the user request object
    // req.user = payload;
    req.user = { userId: payload.userId };

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authnetication Invalid");
  }
};

export default auth;
