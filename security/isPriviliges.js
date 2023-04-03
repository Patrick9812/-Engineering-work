const dotenv = require("dotenv")
dotenv.config();
const User = require("../schemat/userSchema");
const pin = process.env.ADMIN_KEY;

const isPrev = async (req, res, next) => 
{
    const canDoIt = req.session.user;
    if(!canDoIt)
    {
        req.flash("error", "Jesteś nieupoważniony, by tu wejść")
        return res.redirect("/products");
    }
    const email = canDoIt;
    let result = canDoIt.includes(`.${pin}`);
    if(!result)
    {
        req.flash("error", "Jesteś nieupoważniony, by tu wejść")
        return res.redirect("/products");
    }
    next();
}
module.exports = isPrev;