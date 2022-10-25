import { UnauthenticatedError } from "../errors/index.js";

const checkPermissions = (reqUser, resourceUserId) => {
  if (reqUser.userId === resourceUserId.toString()) return;
  throw new UnauthenticatedError("Not authorized to access this route");
};

export default checkPermissions;
