const proces = (req, res, next) => 
{
    const proces = req.session.proces;
    if(!proces)
    {
        req.flash("error", "Jesteś nieupoważniony, by tu wejść")
        return res.redirect("/products");
    }
    next();
}
module.exports = proces;