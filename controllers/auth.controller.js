const service = require("../services/user.service");
const userService = require("../services/user.service");
const { createToken } = require("../utils/jwt.tools");
const controller = {};

controller.register = async (req, res, next) => {
  //si agregas mas datos aqui
  const { username, email, birthdate, password, followupemail } = req.body;

  const { status: emailExists } = await userService.findOneByEmail(email);
  if (emailExists)
    return res.status(409).json({error: true, message:  "el usuario ya existe" });
  const { status: userExists } = await userService.findOneByUsername(username);
  if (userExists)
    return res.status(409).json({ error: true, message:  "el usuario ya existe" });

  const { status: userCreated } = await userService.create(req.body);
  if (!userCreated)
    return res.status(409).json({ error: true, message:  "no se pdo crear el usuario" });

  return res.status(201).json({
    error: false,
    message: "usuario registrado",
  });
};
controller.login = async (req, res, next) => {
  const { email, password } = req.body;

  const { status: userExists, content: user } =
    await userService.findOneByEmail(email);
  if (!userExists)
    return res.status(404).json({ error: true, message:  "el usuario no existe " });

  const passwordCorrect = user.comparePasswords(password);
  if (!passwordCorrect)
    return res.status(401).json({ error: true, message:  "Contraseña incorrecta" });

  const token = createToken(user._id);

  const { status: tokenSaved } = await userService.insertValidToken(
    user,
    token
  );
  if (!tokenSaved) return res.status(409).json({ error: true, message:  "No se pudo logear " });

  return res.status(200).json({
    error: false,
    message: "logeado exitosamente",
    username: user.username,
    email: user.email,
    password: user.hashedPassword,
    birthdate: user.birthdate,
    token,
  });
};

controller.update = async (req, res, next) => {
  try {
    const { username, password, oldPassword, followupemail, email, birthdate } =
      req.body;
    const { status: existUser, content: completeUser } =
      await service.findOneByUsername(username);

      if(completeUser.email != email){
       const { status: existEmail } = await service.findOneByEmail(email); 
       console.log({existEmail});
       if (existEmail) throw " the email is already taken";
      }

    console.log({ existUser, completeUser });

    if (!existUser) throw "Cannot find the user";

    if (!completeUser.comparePasswords(oldPassword)) {
      throw "User and password not match";
    }

    const newUser = service.hashPassword({
      username,
      password,
      followupemail,
      email,
      birthdate,
    });
    console.log({ newUser });

    await service.update(username, newUser);
    const { content } = await service.getUser(username);
    console.log({ content });

    const token = createToken(content._id);
    console.log({ token });

    return res.status(200).json({
      error: false,
      username: content.username,
      email: content.email,
      password: content.hashedPassword,
      birthdate: content.birthdate,
      token,
    });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({ error: true, message: error });
  }
};

module.exports = controller;
