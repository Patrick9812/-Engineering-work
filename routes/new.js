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
    res.render("new");
})

router.post("/", ErrAsync(async (req, res, next) =>
{
    devProd;
    const { error } = devProd.validate(req.body);
    if (error)
    {
        const message = error.details.map(c => c.message).join(",")
        throw new ExpressError(message, 400);
    }
    const { name, value, type, details } = req.body;
    const isCreate = await Prod.findOne({name: name, type: type});
    if(!isCreate)
    {
        await Prod.insertMany({name: name, value: value, images: 'https://source.unsplash.com/collection/9727811', type: type, details: details});
        req.flash('success', "Dodano pomyślnie nowy produkt");
        return res.redirect("/developerProducts");
    }
    else
    {
        req.flash("error", "Istnieje już produkt o takiej nazwie");
        return res.redirect("/developerProducts")
    } 
}))

module.exports = router;