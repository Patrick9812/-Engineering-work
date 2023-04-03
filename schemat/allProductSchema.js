const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const allProductSchema = new Schema
({
    name:
    {
        type: String,
        required: true,
        min: 3,
        max: 40
    },
    value:
    {
        type: Number,
        min: 0,
        max: 1500,
        required: true
    },
    images:
    {
        type: String
    },
    type:
    {
        type: String,
        enum: ["Zestaw Catering", "Sałatka", "Dodatki Skrobiowe", "Mięso", "Naleśniki", "Dodatek Mięsny"],
        required: true
    },
    details:
    {
        type: String,
        required: true,
        max: 120
    }
})

const Prod = mongoose.model("products", allProductSchema);
module.exports = Prod;
