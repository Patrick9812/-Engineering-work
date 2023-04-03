const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const method = require('method-override');
const mate = require("ejs-mate");
const Joi = require("joi");
const Rsa = require("node-rsa");
const client_secret = process.env.client_secret;
const client_id = process.env.client_id;
const session = require("express-session");
const dotenv = require("dotenv")
const paypal = require("paypal-rest-sdk");

paypal.configure({
    'mode': 'sandbox',
    'client_id': client_id,
    'client_secret': client_secret
  });
dotenv.config();

const flash = require("connect-flash");
const bcrypt = require("bcrypt");

const User = require("./schemat/userSchema");
const Trash = require("./schemat/trashSchema");
const Meal = require("./schemat/orderSchema");
const Prod = require("./schemat/allProductSchema");

const ErrAsync = require("./security/asyncSec");
const ExpressError = require("./security/ExpressError");

const devProd = require("./security/joidevProd");
const register = require("./security/joiRegister");

const devProductsRouter = require("./routes/devProducts");
const contactRouter = require("./routes/contact");
const newProdRouter = require("./routes/new");
const loginRouter = require("./routes/login");
const productsRouter = require("./routes/products");
const registerRouter = require("./routes/register");
const logoutRouter = require("./routes/logout");

const sessionKey = process.env.SESSION_KEY;

const app = express();
const port = 4000;

app.set('views', path.join(__dirname , "/views"));
app.set('view engine', 'ejs');
mongoose.set('strictQuery', false);

app.use(method('_method'));
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(flash());

const sessionConfig = 
{
    secret: sessionKey,
    resave: false,
    saveUninitialized: false,
    cookie: 
    {
        expires: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionConfig));

app.use((req, res, next) =>
{
    res.locals.success = req.flash("success");
    res.locals.logeddIn = req.session.user;
    res.locals.edit = req.flash("edit");
    res.locals.proces = req.session.proces;
    res.locals.success = req.session.success;
    res.locals.userId = req.session.userId;
    res.locals.trash = req.session.trash;
    res.locals.adm = req.session.adm;
    res.locals.priv = req.session.priv;
    res.locals.error = req.flash("error");
    next();
})

app.use("/developerProducts", devProductsRouter);
app.use("/new", newProdRouter);
app.use("/login", loginRouter);
app.use("/contact", contactRouter);
app.use("/products", productsRouter);
app.use("/register", registerRouter);
app.use("/logout", logoutRouter);

app.engine("ejs", mate);

main().catch(err => console.log(err));
async function main() 
{
    await mongoose.connect('mongodb://127.0.0.1:27017/impresja');
    console.log("Udało się połączyć")
}
app.get("/", (req, res) =>
{
    res.redirect("/home");
})
app.get("/home", (req, res) =>
{
    res.render("home");
})
app.get("/logout", (req, res) =>
{
    res.redirect("/login")
})
app.post("/logout", ErrAsync (async (req, res) =>
{
    req.session.isAdmin;
    req.session.destroy();
    await User.updateMany({isAdmin: false})
    res.redirect("/login")
}))
app.get("/about", (req, res) =>
{
    res.render("about");
})

app.use((err, req, res, next) =>
{
    const {status = 500} = err;
    if(!err.message)
    {
        err.message = "Coś poszło nie tak";
    }
    res.status(status).render("error", {err});
})

app.listen(port, () =>
{
    console.log(`Serwer działa na porcie ${port}`);
})