const router = require("express").Router();
const authController = require("../../controllers/auth.controller");
const {
  registerValidator,
  loginValidator,
  updateValidator,
} = require("../../validators/auth.validator");
const runValidator = require("../../middlewares/validator.middleware");

router.post(
  "/singup",
  registerValidator,
  runValidator,
  authController.register
);
router.post("/singin", loginValidator, runValidator, authController.login);
router.put("/update", updateValidator, runValidator, authController.update);
module.exports = router;
