const User = require("../models/User");
const ServiceResponse = require("../classes/ServiceResponse");
const { verifyToken } = require("../utils/jwt.tools");
const service = {};
const crypto = require("crypto");
//si agregas mas datos aqui
service.create = async ({
  username,
  email,
  birthdate,
  password,
  followupemail,
}) => {
  try {
    const user = new User({
      username: username,
      email: email,
      birthdate: birthdate,
      password: password,
      followupemail: followupemail,
    });

    const userCreated = await user.save();

    if (!userCreated) return new ServiceResponse(false);

    return new ServiceResponse(true);
  } catch (error) {
    throw error;
  }
};

service.findOneByEmail = async (emailGiven) => {
  try {
    const user = await User.findOne({
      email: emailGiven,
    });

    if (!user) return new ServiceResponse(false);
    return new ServiceResponse(true, user);
  } catch (error) {
    throw error;
  }
};



service.findOneByUsername = async (usernameGiven) => {
  try {
    const user = await User.findOne({
      username: usernameGiven,
    });

    if (!user) return new ServiceResponse(false);
    return new ServiceResponse(true, user);
  } catch (error) {
    throw error;
  }
};

service.insertValidToken = async (user, token) => {
  try {
    user.validTokens = user.validTokens.filter((token) => verifyToken(token));

    const newTokens = [token, ...user.validTokens.slice(0, 4)];

    user.validTokens = newTokens;

    const userSaved = await user.save();

    if (!userSaved) return new ServiceResponse(false);

    return new ServiceResponse(true);
  } catch (error) {
    return error;
  }
};
service.findOneById = async (id) => {
  try {
    const user = await User.findById(id);

    if (!user) return new ServiceResponse(false);
    return new ServiceResponse(true, user);
  } catch (error) {
    throw error;
  }
};
service.validateToken = async (user, token) => {
  try {
    const index = user.validTokens.findIndex(
      (validToken) => validToken === token
    );
    if (index < 0) return new ServiceResponse(false);

    return new ServiceResponse(true);
  } catch (error) {
    throw error;
  }
};

service.getUser = async (username) => {
  try {
    const user = await User.findOne({ username });

    if (!user) return new ServiceResponse(false);

    return new ServiceResponse(true, user);
  } catch (error) {
    throw error;
  }
};

service.update = async (username, newUser) => {
  try {
    await User.findOneAndUpdate({ username }, newUser);

    return new ServiceResponse(true);
  } catch (error) {
    throw error;
  }
};

service.hashPassword = (user) => {
  user.salt = makeSalt();
  user.hashedPassword = encryptPassword(user.password, user.salt);
  return user;
};

/* NO SUPE COMO ACTUALIZAR EL HASH*/
function makeSalt() {
  return Math.round(new Date().valueOf() * Math.random()) + "";
}

function encryptPassword(password, salt) {
  if (!password) return "";

  try {
    const encryptedPassword = crypto
      .createHash("sha256", salt)
      .update(password)
      .digest("hex");

    return encryptedPassword;
  } catch {
    return "";
  }
}

module.exports = service;
