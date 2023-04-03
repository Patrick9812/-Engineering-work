const success = (req, res, next) => 
{
    const success = req.session.success;
    if(!success)
    {
        req.flash("error", "Jesteś nieupoważniony, by tu wejść")
        return res.redirect("/products");
    }
    next();
}
module.exports = success;