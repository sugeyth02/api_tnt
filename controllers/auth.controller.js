const userService= require("../services/user.service")
const {createToken} = require("./../utils/jwt.tools")
const controller = {};


controller.register = async (req, res, next) => {
    //si agregas mas datos aqui
    const {username, email, birthdate, password, followupemail} = req.body;
    
    const {status:emailExists} = await userService.findOneByEmail(email);
    if(emailExists) return res.status(409).json({error: "el usuario ya existe"});
    const {status:userExists} = await userService.findOneByUsername(username);
    if(userExists) return res.status(409).json({error: "el usuario ya existe"});
    
    const {status:userCreated}= await userService.create(req.body);
    if(!userCreated) return res.status(409).json({error: "no se pdo crear el usuario"});

    return res.status(201).json({
        message: "usuario registrado"
    })
    
}
controller.login = async (req, res, next) => {
    const {email, password} = req.body;

    const {status: userExists, content: user} = await userService.findOneByEmail(email);
    if(!userExists) return res.status(404).json({ error: "el usuario no existe " });

    const passwordCorrect = user.comparePasswords(password);
    if(!passwordCorrect) return res.status(401).json({error: "Contraseña incorrecta"});

    const token = createToken(user._id);

    const { status: tokenSaved } = await userService.insertValidToken(user, token);
    if(!tokenSaved) return res.status(409).json({error: "No se pudo logear "});

    return res.status(200).json({token: token})

}

module.exports = controller