const express = require("express");
const app = express();
const router = express.Router();
const clientId = process.env.client_id;
const clientSecret = process.env.client_secret;
const secretRSA = process.env.RSA_KEY;
const crypto = require("crypto");
const paypal = require("paypal-rest-sdk");
paypal.configure({
    'mode': 'sandbox',
    'client_id': clientId,
    'client_secret': clientSecret
  });
const User = require("../schemat/userSchema");
const proces = require("../security/isPayed");
const success = require("../security/success");
const Trash = require("../schemat/trashSchema");
const Meal = require("../schemat/orderSchema");
const Promo = require("../schemat/znizkiSchema");
const needLogin = require("../security/isLoggedIn")
const Prod = require("../schemat/allProductSchema");
const { encrypt, decrypt } = require('../security/crypto')
const Joi = require("joi");
const joiOrder = require("../security/joiOrder");
const ErrAsync = require("../security/asyncSec");
const ExpressError = require("../security/ExpressError");
const devProd = require("../security/joidevProd");
const register = require("../security/joiRegister");
const currentData = require("../security/currentData");
app.use((req, res, next) =>
{
    res.locals.success = req.flash("success");
    res.locals.edit = req.flash("edit");
    res.locals.error = req.flash("error");
    next();
})

app.use((req, res, next) =>
{
    res.locals.success = req.flash("success");
    res.locals.edit = req.flash("edit");
    res.locals.error = req.flash("error");
    next();
})

router.get("/", needLogin, ErrAsync(async(req, res) =>
{
    const id = req.session.user;
    const userId = req.session.userId;
    const catering = await Prod.find({type: "Zestaw Catering"});
    const salad = await Prod.find({type: "Sałatka"});
    const fries = await Prod.find({type: "Dodatki Skrobiowe"});
    const meat = await Prod.find({type: "Mięso"});
    const pancakes = await Prod.find({type: "Naleśniki"});
    const meatset = await Prod.find({type: "Dodatek Mięsny"});
    const trash = await Trash.find({owner: userId});
    const trashCheck = req.session.trash;
    let cost = 0;
    for(let i=0; i<trash.length; i++)
    {
        cost = cost + (trash[i].value * trash[i].quantity);
    }
    res.render("products", {catering, salad, fries, meat, pancakes, meatset, trash, cost, userId, trashCheck});
}))
router.post("/:id", needLogin, ErrAsync(async(req, res) =>
{
    const { id } = req.params;
    req.session.trash = 1;
    const loginUserId = req.session.userId;
    const sec = await Prod.findById(id);
    if(!sec)
    {
        req.flash("error", "Nie znaleziono produktu");
        return res.redirect("/products");
    }
    const { name, value, type, details } = await Prod.findById(id);
    const isCreate = await Trash.findOne({name: name, owner: loginUserId});
    if(!isCreate)
    {
        const trashAdd = await Trash.insertMany({name: name, value: value, quantity: 1, type: type, owner: loginUserId});
    }
    else
    {
        let quan = isCreate.quantity;
        const lama = await Trash.findOne({name: name, owner: loginUserId});
        quan++;
        const result = await Trash.findByIdAndUpdate(lama._id, {quantity: quan});
        await result.save();
    }
    const prod = await Trash.findById(id);
    res.redirect("/products");
}))

router.post("/check/:id", needLogin, ErrAsync(async(req, res) =>
{
    const id = req.session.userId;
    req.session.proces = 1;
    res.redirect(`/products/podsumowanie/${id}`)
}))

router.get("/podsumowanie", needLogin, ErrAsync(async(req, res) =>
{
    req.flash("error", "Administracja nie może realizować zamówień, gdyż byłoby to nieuczciwe. Załóż zwykłe konto.");
    return res.redirect(`/products`);
}))

router.get("/podsumowanie/:id", proces, needLogin, ErrAsync(async(req, res) =>
{
    const id = req.session.userId;
    const trash = await Trash.find({owner: id});
    let cost = 0;
    const dateTime = currentData();
    const day = dateTime[0];
    const msc = dateTime[1];
    const year = dateTime[2];
    const hour = dateTime[3];
    const min = dateTime[4];
    for(let b=0; b<trash.length; b++)
    {
        cost = cost + (trash[b].value * trash[b].quantity);
    }
    res.render("order", {id, day, msc, year, hour, min, cost})
}))

router.post("/podsumowanie/:id", needLogin, ErrAsync(async(req, res) =>
{
    const id = req.session.userId;
    const promocode = await Promo.find({});
    const trash = await Trash.find({owner: id});
    const { error } = joiOrder.validate(req.body);
    if (error)
    {
        const message = error.details.map(c => c.message).join(",")
        throw new ExpressError(message, 400);
    }
    const { date, promocja, miasto, code, adres, tel, house, payMethod } = req.body;
    const telHash = encrypt(tel);
    let find;
    const formDate = new Date(date).getTime();
    let boolean = false;
    const dated = new Date(date).getTime();
    const aktData = new Date().getTime();
    const godz = new Date(date).getHours();
    const post = dated + 1800000;            
    const pre = dated - 1800000;
    const postgodz = new Date(post).getHours();
    const postmin = new Date(post).getMinutes();
    const pregodz = new Date(pre).getHours();
    const premin = new Date(pre).getMinutes();
    let newpostgodz, newpostmin, newpregodz, newpremin;
    newpostgodz = postgodz;
    newpostmin = postmin;
    newpregodz = pregodz;
    newpremin = premin;
    if(postgodz < 10)
    {
        newpostgodz = `0${postgodz}`;
    }
    else
    {
        newpostgodz = `${postgodz}`;
    }
    if(postmin < 10)
    {
        newpostmin = `0${postmin}`;
    }
    else
    {
        newpostmin = `${postmin}`;
    }
    if(pregodz < 10)
    {
        newpregodz = `0${pregodz}`;
    }
    else
    {
        newpregodz = `${pregodz}`;
    }
    if(premin < 10)
    {
        newpremin = `0${premin}`;
    }
    else
    {
        newpremin = `${premin}`;
    }
    const meal = await Meal.find({});
    let kod=["44-313", "44-300", "44-300", "44-301", "44-370", "44-280", "44-293", "44-310"];
    const tab = [];
    for(let b=0; b<trash.length; b++)
    {
        tab.push(trash[b]);
    }
    let cost = 0;
    for(let i=0; i<trash.length; i++)
    {
        cost = cost + (trash[i].value * trash[i].quantity);
    }
    const pro = promocja.toString()
    for(let s=0; s<promocode.length; s++)
    {
        const valueProm = promocode[s].value;
        const kod = promocode[s].promoCode.toString();
        if(kod === pro)
        {
            find = valueProm;
            boolean = true;
        }
    }
    
    for(let i=0; i<meal.length; i++)
    {
        const check = meal[i].date;
        if(check < post && check > pre)
        {
            req.flash("error", `Termin jest już zajęty. Spróbuj zamówić na godzinę ${newpregodz}:${newpremin} lub ${newpostgodz}:${newpostmin}`);
            return res.redirect(`/products/podsumowanie/${id}`);
        }
    }
    if(!promocja)
    {
        
    }
    else if(boolean === false)
    {
        req.flash("error", "Podano zły kod promocyjny. Spróbuj ponownie.");
        return res.redirect(`/products/podsumowanie/${id}`);
    }
    else if(boolean === true)
    {
        const pro1 = `0.0${find}`
        let final = parseFloat(pro1);
        costdel = cost * final;
        cost = cost - costdel;
        cost.toFixed(1);
    }
    if(formDate <= aktData + 345600000)
    {
        req.flash("error", "Podano zły czas realizacji zamówienia");
        return res.redirect("/products/podsumowanie/:id");
    }
    if(godz < 8 || godz > 23)
    {
        req.flash("error", "Zamówienia realizujemy tylko w godzinach 8-23");
        return res.redirect(`/products/podsumowanie/${id}`);
    }
    let bool = false;
    for(let t=0; t<kod.length; t++)
    {
        if(code === kod[t])
        {
            bool = true;
        }
    }
    if(bool === false && adres)
    {
        req.flash("error", "Nie dowozimy do twojego miejsca zamieszkania");
        return res.redirect(`/products/podsumowanie/${id}`);
    }
    if(!adres && payMethod === "paypal")
    {
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `http://localhost:4000/products/podsumowanie/${id}/success`,
                "cancel_url": `http://localhost:4000/products/podsumowanie/${id}/error`
            },
            "transactions": [{
                "amount": {
                    "currency": "PLN",
                    "total": cost
                },
                "description": "This is the payment description."
            }]
        };
        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                Meal.insertMany({date: dated, cost: cost, telephone: telHash, method: "Odbiór osobisty", payMethod: payMethod, payed: "Tak", products: tab, author: id})
                req.session.proces = 0;
                req.session.success = 1;
                for(let i=0; i<payment.links.length;i++)
                {
                    if(payment.links[i].rel === "approval_url")
                    {
                        res.redirect(payment.links[i].href)
                    }
                }
            }
        });
        
    }
    else if(adres && payMethod === "paypal")
    {
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `http://localhost:4000/products/podsumowanie/${id}/success`,
                "cancel_url": `http://localhost:4000/products/podsumowanie/${id}/error`
            },
            "transactions": [{
                "amount": {
                    "currency": "PLN",
                    "total": cost
                },
                "description": "This is the payment description."
            }]
        };
        paypal.payment.create (create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                miastoHash = encrypt(miasto);
                postHash = encrypt(code);
                adresHash = encrypt(adres);
                houseHash = encrypt(house);
                Meal.insertMany({date: dated, cost: cost, city: miastoHash, postCode: postHash, street: adresHash, house: houseHash, telephone: telHash, method: "Dostawa", payMethod: payMethod, payed: "Tak",products: tab, author: id})
                req.session.proces = 0;
                req.session.success = 1;
                for(let i=0; i<payment.links.length;i++)
                {
                    if(payment.links[i].rel === "approval_url")
                    {
                        res.redirect(payment.links[i].href)
                    }
                }
            }
        });
    }
    else if(adres && payMethod === "gotówka")
    {
        miastoHash = encrypt(miasto);
        postHash = encrypt(code);
        adresHash = encrypt(adres);
        houseHash = encrypt(house);
        Meal.insertMany({date: dated, cost: cost, city: miastoHash, postCode: postHash, street: adresHash, house: houseHash, telephone: telHash, method: "Dostawa", payMethod: payMethod, payed: "Nie",products: tab, author: id})
        req.session.proces = 0;
        req.session.success = 1;
        return res.redirect("/products/podsumowanie/:id/success")
    }
    else if(!adres && payMethod === "gotówka")
    {
        const lama = await Meal.insertMany({date: dated, cost: cost, telephone: telHash, method: "Odbiór osobisty", payMethod: payMethod, payed: "Nie", products: tab, author: id});
        req.session.proces = 0;
        req.session.success = 1;
        return res.redirect("/products/podsumowanie/:id/success")
    }
}))

router.get("/podsumowanie/:id/success", success, needLogin, ErrAsync(async(req, res) =>
{
    const id = req.session.userId;
    req.session.proces = 0;
    const trashProd = await Trash.find({owner: id});
    const trash = await Trash.deleteMany({owner: id});
    req.session.trash = 0;
    req.session.success = 0;
    res.render("summary");
}))

router.get("/podsumowanie/:id/error", success, needLogin, ErrAsync(async(req, res) =>
{
    const id = req.session.userId;
    req.session.proces = 0;
    req.session.success = 0;
    res.render("payError");
}))

router.delete("/:id", needLogin,  ErrAsync(async(req, res) =>
{
    const {id} = req.params;
    await Trash.findByIdAndDelete(id);
    res.redirect("/products")
}))

router.get("/:id/details", needLogin, ErrAsync(async(req, res) =>
{
    const { id } = req.params;
    const {name, value, type, details, images} = await Prod.findById(id);
    if(!id)
    {
        req.flash("error", "Nie znaleziono produktu")
        return res.redirect("/developerProducts")
    }
    res.render("det", {name, value, type, details, images});
}))

router.put("/:id/min", needLogin, ErrAsync(async(req, res) =>
{
    const {id} = req.params;
    const par = await Trash.findById(id);
    let quan = par.quantity;
    quan--;
    if(quan > 0)
    {
        const result = await Trash.findByIdAndUpdate(id, {quantity: quan});
        await result.save();
    }
    else
    {
        await Trash.findByIdAndDelete(id);
    }
    res.redirect("/products");
}))

router.put("/:id/add", needLogin, ErrAsync(async(req, res) =>
{
    const {id} = req.params;
    const par = await Trash.findById(id);
    let quan = par.quantity;
    quan++;
    const result = await Trash.findByIdAndUpdate(id, {quantity: quan});
    await result.save();
    res.redirect("/products");
}))

router.get("/:id/clientOrders", needLogin, ErrAsync(async(req, res) =>
{
    const id = req.session.userId;
    const licz = new Date().getTime();
    const liczpost = new Date(licz+604800000).getTime();
    const liczpre = new Date(licz-604800000).getTime();
    const data = parseInt(licz);
    const post = parseInt(liczpost);
    const order = await Meal.find({author: id, date: {$gte: data}}).sort({date: -1});
    const usun2 = await Meal.find({date: {$lt: liczpre}});
    if(usun2)
    {
        await Meal.deleteMany({date: {$lt: liczpre}});
    }
    res.render("clientOrders", {order});
}))
router.get("/:id/clientOrders/details", needLogin, ErrAsync(async(req, res) =>
{
    const {id} = req.params;
    const userId = req.session.userId;
    const {date, cost, city, postCode, street, house, telephone, method, payMethod, payed, isDone, products, author} = await Meal.findOne({_id: id}).populate("products");
    res.render("clientDetails", {products, cost, id});
}))
module.exports = router;