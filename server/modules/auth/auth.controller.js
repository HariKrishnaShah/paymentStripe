const bcrypt = require("bcrypt");
const authModel = require("../auth/auth.model");
const userModel = require("../users/user.model");
const { mail } = require("../../services/mail");
const { generateOTP, verifyOTP } = require("../../utils/otp");
const { generateJWT } = require("../../utils/jwt");

const create = async (payload) => {
  const { password, roles, ...rest } = payload;
  rest.password = await bcrypt.hash(password, +process.env.SALT_ROUND);
  const user = await userModel.create(rest);
  const token = generateOTP();
  await authModel.create({ email: user?.email, token });
  // send token to email
  const mail = await mail(user?.email, token);
  return mail;
};

const login = async (email, password) => {
  const user = await userModel
    .findOne({ email, isArchived: false })
    .select("+password");
  if (!user) throw new Error("User not found");
  // Email Exist ??
  if (!user.isEmailVerified)
    throw new Error("Email is not verified. Verify to get started");
  // Is user active ??
  if (!user.isActive) throw new Error("User is blocked. Please contact Admin");
  const result = await bcrypt.compare(password, user?.password);
  if (!result) throw new Error("Email or Password is invalid");
  // Generate the token
  const token = generateJWT({ email: user?.email, roles: user?.roles ?? [] });
  return { token };
};

const verifyEmail = async (email, token) => {
  // authModel email check
  const user = await authModel.findOne({ email });
  if (!user) throw new Error("User not found");
  // is User Verified
  if (user.isEmailVerified) throw new Error("User is already verified");
  //otp check
  const isValidOTP = verifyOTP(token);
  if (!isValidOTP) throw new Error("Token expired");
  // authmodel otp token compare
  const isValid = user?.token === +token;
  if (!isValid) throw new Error("Token Mismatched");
  // usermodel isEmailVerified true
  await userModel.findOneAndUpdate(
    { email },
    { isEmailVerified: true },
    { new: true }
  );
  // delete auth model token
  await authModel.deleteOne({ email });
  return true;
};

const regenerateToken = async (email) => {
  // authModel email check
  const user = await authModel.findOne({ email });
  if (!user) throw new Error("User not found");
  //generate new OTP
  const token = generateOTP();
  await authModel.findOneAndUpdate({ email }, { token });
  // send the token to email
  await mail(email, token);
  return true;
};

const generateFPToken = async (email) => {
  const user = await userModel.findOne({ email });
  if (!user) throw new Error("User not found");
  const token = generateOTP();
  await authModel.create({ email: user?.email, token });
  // send token to email
  return mail(user?.email, token);
};

const forgotPassword = async (email, token, password) => {
  // Validate the email
  const user = await authModel.findOne({ email });
  if (!user) throw new Error("User not found");
  // Check if token has expired
  const isValidOTP = verifyOTP(token);
  if (!isValidOTP) throw new Error("Token expired");
  // authmodel otp token compare
  const isValid = user?.token === +token;
  if (!isValid) throw new Error("Token Mismatched");
  // replace the stored password with new password
  await userModel.findOneAndUpdate(
    { email },
    { password: await bcrypt.hash(password, +process.env.SALT_ROUND) },
    { new: true }
  );
  // delete auth model token
  await authModel.deleteOne({ email });
  return true;
};

module.exports = {
  create,
  forgotPassword,
  generateFPToken,
  login,
  regenerateToken,
  verifyEmail,
};
