const UserModel = require("../modules/users/user.model");
const { verifyJWT } = require("./jwt");

const compareRoles = (requiredRoles, userRoles) => {
  if (requiredRoles.length === 0) return true;
  //check and compare the role
  return userRoles.some((v) => requiredRoles.indexOf(v) !== -1);
};

const secureAPI = (roles) => {
  return async (req, res, next) => {
    try {
      const token = req?.headers?.authorization;
      if (!token) throw new Error("Access Token is required");
      const accessToken = token.split("Bearer ")[1];
      // Check if the accessToken is valid or not
      const { data } = verifyJWT(accessToken);
      const { email } = data;
      // user exist check
      const user = await UserModel.findOne({ email });
      if (!user) throw new Error("User not found");
      const { roles: userRoles, _id } = user;
      req.currentUser = _id;
      req.currentRoles = userRoles;
      // user role check
      const isAllowed = compareRoles(roles ?? [], userRoles);
      if (!isAllowed) throw new Error("User Unauthorized");
      next();
    } catch (e) {
      next(e);
    }
  };
};

module.exports = secureAPI;
