const mongoose = require("mongoose")
const Schema = mongoose.Schema;
mongoose.set('strictQuery', false);
const promoSchema = new Schema
({
    promoCode:
    {
        type: String,
        required: true
    },
    value:
    {
        type: Number,
        required: true
    }
})
const Promo = mongoose.model("promos", promoSchema);
module.exports = Promo;
