const validator = {};
const {body} = require("express-validator");

let d = new Date()
let year = d.getFullYear();
let month = d.getMonth();
let day = d.getDate();
let cA = new Date(year, month, day).toDateString();
//si agregas mas datos aqui 
validator.registerValidator= [

  body("username")
      .notEmpty().withMessage("Username no puede venir vacia")
      .isLength({min: 4, max: 16}).withMessage("minimo 4 maximo 16"),
  body("email")
      .optional()
      .notEmpty().withMessage("email no puede venir vacia")
      .isEmail().withMessage("email debe de ser un correo"),
  body("birthdate")
      .optional()
      .notEmpty().withMessage("nacimiento no puede venir vacia")
      .isDate().withMessage("la fecha de nacimiento no es valida")
      .isBefore(cA).withMessage("ingrese una fecha valida"),
  body("password")
      .notEmpty().withMessage("password no puede venir vacia")
      .isLength({min:8, max:16}).withMessage("minimo 8 maximo 16"),
  body("followupemail")
      .optional()
      .notEmpty().withMessage("email no puede venir vacia")
      .isEmail().withMessage("email debe de ser un correo")
]

validator.loginValidator = [
    body("email")
    .optional()
    .notEmpty().withMessage("email no puede venir vacia")
    .isEmail().withMessage("email debe de ser un correo"),
    body("password")
        .notEmpty().withMessage("password no puede venir vacio")
]

module.exports = validator;