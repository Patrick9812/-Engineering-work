const express = require("express");
const app = express();
const router = express.Router();
const User = require("../schemat/userSchema");
const Trash = require("../schemat/trashSchema");
const Meal = require("../schemat/orderSchema");
const Prod = require("../schemat/allProductSchema");
const validateAdminCode = process.env.ADMIN_PIN;
const secretRSA = process.env.RSA_KEY;
const crypto = require("crypto");
const mealJoi = require("../security/joiOrderEdit")
const isAdmin = require("../security/isAdmin");
const Promo = require("../schemat/znizkiSchema");
const isPrev = require("../security/isPriviliges");
const { encrypt, decrypt } = require('../security/crypto')
const Joi = require("joi");
const ErrAsync = require("../security/asyncSec");
const ExpressError = require("../security/ExpressError");
const needLogin = require("../security/isLoggedIn")
const devProd = require("../security/joidevProd");

router.get("/", isAdmin, ErrAsync(async (req, res) =>
{
    const catering = await Prod.find({type: "Zestaw Catering"});
    const salad = await Prod.find({type: "Sałatka"});
    const fries = await Prod.find({type: "Dodatki Skrobiowe"});
    const meat = await Prod.find({type: "Mięso"});
    const pancakes = await Prod.find({type: "Naleśniki"});
    const meatset = await Prod.find({type: "Dodatek Mięsny"});
    res.render("devAllProducts", {catering, salad, fries, meat, pancakes, meatset});
}))

router.get("/enterPin", isPrev, ErrAsync(async (req, res) =>
{
    res.render("enterPin");
}))

router.post("/enterPin", isPrev, needLogin, ErrAsync(async (req, res) =>
{
    const id = req.session.userId;
    const {secretPin} = req.body;
    if(secretPin === validateAdminCode)
    {
        user = req.session.user;
        req.session.adm = true;
        res.redirect("/developerProducts")
    }
    else
    {
        req.flash("error", "Jesteś nieupoważniony, by tu wejść");
        req.session.priv = 1;
        res.redirect("/products");
    } 
}));

router.get("/promoCode", isAdmin, ErrAsync(async (req, res) =>
{
    res.render("devPromoCode");
}));

router.post("/promoCode", isAdmin, ErrAsync(async (req, res) =>
{
    const {promo, promoValue} = req.body;
    const exist = await Promo.findOne({ promoCode: promo});
    if(promo.length > 19)
    {
        req.flash("error", "Kod promocyjny powinien być krótszy niż 20 znaków")
    }
    else if(exist)
    {
        req.flash("error", "Isnieje już taki kod")
    }
    else if(promoValue > 100)
    {
        req.flash("error", "Wartość kodu musi być mniejsza lub równa 100%")
    }
    else
    {
        await Promo.insertMany({promoCode: promo, value: promoValue});
        req.flash("success", "Pomyślnie dodano kod promocyjny");
    }
    res.redirect("/developerProducts/promoCode")
}));

router.get("/promoCode/allPromos", isAdmin, ErrAsync(async (req, res) =>
{
    const promo = await Promo.find({})
    res.render("allPromoCodes", {promo})
}));

router.get("/promoCode/:id", isAdmin, ErrAsync(async (req, res) =>
{
    const {id} = req.params;
    const {promoCode, value} = await Promo.findById(id);
    res.render("devPromoCodeEdit", {id, promoCode, value})
}));

router.post("/promoCode/:id", isAdmin, ErrAsync(async (req, res) =>
{
    const {id} = req.params;
    const {promoCode, value} = req.body;
    const exist = await Promo.findOne({ promoCode: promoCode });
    if(promoCode.length > 19 && promoCode.length < 5)
    {
        req.flash("error", "Niepoprawny kod rabatowy")
        return res.redirect(`/developerProducts/promoCode/allPromos`);
    }
    else if(exist)
    {
        req.flash("error", "Isnieje już taki kod");
        return res.redirect(`/developerProducts/promoCode/allPromos`);
    }
    else if(value > 100 && value < 0)
    {
        req.flash("error", "Wartość kodu musi być mniejsza lub równa 100%")
        return res.redirect(`/developerProducts/promoCode/allPromos`);
    }
    else
    {
        await Promo.findByIdAndUpdate(id, req.body, {runValidators: true});
        req.flash("success", "Pomyślnie edytowano kod promocyjny");
        res.redirect("/developerProducts/promoCode/allPromos")
    }
}));

router.delete("/promoCode/:id", isAdmin, ErrAsync(async (req, res) =>
{
    const {id} = req.params;
    const {promoCode, value} = await Promo.findByIdAndDelete(id);
    res.redirect("/developerProducts/promoCode/allPromos")
}));

router.get("/orders", isAdmin, ErrAsync(async (req, res) =>
{
    const id = req.session.userId;
    const licz = new Date().getTime();
    const liczpost = new Date(licz+604800000).getTime();
    const liczpre = new Date(licz-604800000).getTime();
    const data = parseInt(licz);
    const post = parseInt(liczpost);
    const futureOrders = await Meal.find({date: {$gte: data, $lte: post}, delete: false}).sort({date: 1});
    const pastOrders = await Meal.find({date: {$lt: data, $gt: liczpre}, delete: false}).sort({date: -1});
    const usun2 = await Meal.find({date: {$lt: liczpre}});
    if(usun2)
    {
        await Meal.deleteMany({date: {$lt: liczpre}});
    }
    res.render("devAllOrders", {pastOrders, futureOrders});
}))

router.get("/:id", isAdmin, ErrAsync(async (req, res) =>
{
    const {id} = req.params;
    const dev = await Prod.findById(id);
    if(!dev)
    {
        req.flash("error", "Nie znaleziono produktu")
        return res.redirect("/developerProducts")
    }
    res.render("devEdit", {dev});
}))

router.put("/:id", isAdmin, ErrAsync(async (req, res) =>
{
    devProd;
    const { error } = devProd.validate(req.body);
    if (error)
    {
        const message = error.details.map(c => c.message).join(",")
        throw new ExpressError(message, 400);
    }
    const {id} = req.params;
    await Prod.findByIdAndUpdate(id, req.body, {runValidators: true});
    req.flash("edit", "Pomyślnie zmieniono daną");
    res.redirect("/developerProducts");
}))

router.delete("/:id", isAdmin, ErrAsync(async (req, res) =>
{
    const { id } = req.params;
    const {name} = await Prod.findById(id);
    await Prod.findByIdAndDelete(id);
    await Trash.deleteOne({name: name});
    res.redirect("/developerProducts");
}))

router.get("/new", (req, res) =>
{
    res.render("new");
})

router.post("/new", isAdmin, ErrAsync(async (req, res, next) =>
{
    const { name, value, type, details } = req.body;
    devProd;
    const { error } = devProd.validate(req.body);
    if (error)
    {
        const message = error.details.map(c => c.message).join(",")
        throw new ExpressError(message, 400);
    }
    else
    {
        await Prod.insertMany({name: name, value: value, images: 'https://source.unsplash.com/collection/9727811', type: type, details: details});
        req.flash('success', "Dodano pomyślnie nowy produkt");
        res.redirect("/developerProducts");
    }
}))

router.get("/orders/orderEdit/:id", isAdmin, ErrAsync(async (req, res, next) =>
{
    const {id} = req.params;
    const {date, cost, city, postCode, street, house, telephone, method, payMethod, payed, isDone, products, author} = await Meal.findOne({_id: id}).populate("author")
    const intData = parseInt(date);
    const day = new Date(intData).getDate();
    const hour = new Date(intData).getHours();
    const rok = new Date(intData).getFullYear();
    const msc = new Date(intData).getMonth()+1;
    const min = new Date(intData).getMinutes();
    const dataa = `${day}.${msc}.${rok} ${hour}:${min}`
    res.render("devOrderEdit", {day, hour, rok, msc, min, dataa, date, cost, city, postCode, street, house, telephone, method, payMethod, payed, isDone, products, author, id});
}))

router.put("/orders/orderEdit/:id", isAdmin, ErrAsync(async (req, res, next) =>
{
    const {id} = req.params;
    const {ready, payed, method} = await req.body;
    const { error } = mealJoi.validate(req.body);
    if (error)
    {
        const message = error.details.map(c => c.message).join(",")
        throw new ExpressError(message, 400);
    }
    const meal = await Meal.findByIdAndUpdate(id, {isDone: ready, payed: payed, method: method}, {runValidators: true})
    res.redirect("/developerProducts/orders")
}))

router.delete("/orders/:id", isAdmin, ErrAsync(async (req, res, next) =>
{
    const { id } = req.params;
    await Meal.findByIdAndUpdate(id, {delete: true}, {runValidators: true});
    res.redirect("/developerProducts/orders");
}))

router.get("/orders/details/:id", isAdmin, ErrAsync(async (req, res, next) =>
{
    const { id } = req.params;
    const {date, cost, city, postCode, street, house, telephone, method, payMethod, payed, isDone, products, author}
    = await Meal.findOne({_id: id}).populate("author").populate("products");
    const telHash = decrypt(telephone);
    const firstHash = decrypt(author.first);
    const secondHash = decrypt(author.sec);
    if(!city)
    {
        let cityHash;
        let codeHash;
        let streetHash;
        let houseHash;
        return res.render("devOrderDetails", {date, cost, telHash, cityHash, streetHash, houseHash, codeHash, method, payMethod, payed, isDone, products, firstHash, secondHash});
    }
    else
    {
        const cityHash = decrypt(city);
        const codeHash = decrypt(postCode);
        const streetHash = decrypt(street);
        const houseHash = decrypt(house);
        return res.render("devOrderDetails", {date, cost, telHash, cityHash, streetHash, houseHash, codeHash, method, payMethod, payed, isDone, products, firstHash, secondHash});
    }
}));

router.get("/orders/deleteOrders", isAdmin, ErrAsync(async(req, res) => 
{
    const licz = new Date().getTime();
    const liczpost = new Date(licz+604800000).getTime();
    const liczpre = new Date(licz-604800000).getTime();
    const data = parseInt(licz);
    const post = parseInt(liczpost);
    const usun = await Meal.find({date: {$lt: liczpost, $gt: liczpre}, delete: true}).sort({date: -1});
    const usun2 = await Meal.find({date: {$lt: liczpre}});
    if(usun2)
    {
        await Meal.deleteMany({date: {$lt: liczpre}});
    }
    res.render("deleteOrders", {usun});
}))

router.post("/orders/deleteOrders/:id", isAdmin, ErrAsync(async(req, res) => 
{
    const {id} = req.params;
    await Meal.findByIdAndUpdate(id, {delete: false}, {runValidators: true});
    res.redirect("/developerProducts/orders");
}))

module.exports = router;