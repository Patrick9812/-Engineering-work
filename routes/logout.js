const express = require("express");
const app = express();
const router = express.Router();
const User = require("../schemat/userSchema");
const Trash = require("../schemat/trashSchema");
const Meal = require("../schemat/orderSchema");
const Prod = require("../schemat/allProductSchema");
const Joi = require("joi");
const ErrAsync = require("../security/asyncSec");
const ExpressError = require("../security/ExpressError");
const devProd = require("../security/joidevProd");
const register = require("../security/joiRegister");

router.get("/", (req, res) =>
{
    req.session.user_id = null;
    req.flash("success", "Pomyślnie wylogowano");
    res.redirect("/home");
})
module.exports = router;