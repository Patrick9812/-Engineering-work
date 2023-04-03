const needLogin = (req, res, next) =>
{
    if(!req.session.user)
    {
        req.flash("error", "Musisz być zalogowany");
        return res.redirect("/login")
    }
    else
    next();
}
module.exports = needLogin;