const adminn = (req, res, next) => 
{
    const isAdmin = req.session.adm;
    if(!isAdmin)
    {
        req.flash("error", "Jesteś nieupoważniony, by tu wejść")
        return res.redirect("/products");
    }
    next();
}
module.exports = adminn;