const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const router = express.Router();
const adminKey = process.env.ADMIN_KEY;
const adminEmail = process.env.ADMIN_EMAIL;
const User = require("../schemat/userSchema");
const Trash = require("../schemat/trashSchema");
const Meal = require("../schemat/orderSchema");
const Prod = require("../schemat/allProductSchema");
const Joi = require("joi");
const ErrAsync = require("../security/asyncSec");
const session = require("express-session");
const ExpressError = require("../security/ExpressError");


router.get("/", (req, res) =>
{
    res.render("login");
})

router.post("/", ErrAsync(async (req, res) =>
{
    const {email, password} = req.body;
    const user = await User.findOne({ email });
    if(!user)
    {
        req.flash("error", "Takie konto nie istnieje. Załóż je");
        return res.redirect("/login");
    }
    const valid = await bcrypt.compare(password, user.password);
    if(valid && !email.includes(`.${adminKey}`))
    {
        req.session.user = user.email;
        req.session.isAdmin = user.isAdmin;
        req.session.userId = user.id;
        req.session.trash = 0;
        req.session.priv = 0;
        req.session.success = 0;
        req.session.proces = 0;
        return res.redirect("/products");
    }
    else if(valid && email.includes(`.${adminKey}`))
    {
        req.session.user = user.email;
        req.session.userId = user.id;
        req.session.isAdmin = user.isAdmin;
        req.session.priv = 0;
        return res.redirect("/developerProducts/enterPin");
    }
    else
    {
        req.flash("error", "Złe dane logowania. Spróbuj jeszcze raz");
        res.redirect("/login");
    }
    
}))

module.exports = router;