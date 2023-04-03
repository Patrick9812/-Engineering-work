const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const dotenv = require("dotenv")
dotenv.config();
const router = express.Router();
const User = require("../schemat/userSchema");
const Trash = require("../schemat/trashSchema");
const Meal = require("../schemat/orderSchema");
const Prod = require("../schemat/allProductSchema");
const session = require("express-session")
const Joi = require("joi");
const { encrypt, decrypt } = require('../security/crypto')
const secretRSA = process.env.RSA_KEY;
const adminKey = process.env.ADMIN_KEY;
const ErrAsync = require("../security/asyncSec");
const ExpressError = require("../security/ExpressError");
const devProd = require("../security/joidevProd");
const joiregister = require("../security/joiRegister");


router.get("/", (req, res) =>
{
    res.render("register");
})
router.post("/", ErrAsync(async (req, res) =>
{
    const { error } = joiregister.validate(req.body);
    if (error)
    {
        const message = error.details.map(c => c.message).join(",")
        throw new ExpressError(message, 400);
    }
    const { email, password, first, sec } = req.body;
    const hash = await bcrypt.hash(password, 13);
    nazwHash = encrypt(sec);
    imieHash = encrypt(first);
    const user = await new User({email: email, password: hash, first: imieHash, sec: nazwHash});
    const isCreate = await User.findOne({email: email});
    if(!isCreate)
    {
        await user.save();
        req.flash("success", "Pomyślnie się zarejestrowano");
        req.session.user_id = user;
        return res.redirect("/login");
    }
    else
    {
        req.flash("error", "Istnieje użytkownik o tym emailu. Podaj inny email");
        return res.redirect("/register")
    }   
}))

module.exports = router;