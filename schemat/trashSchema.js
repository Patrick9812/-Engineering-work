const mongoose = require("mongoose")
const Schema = mongoose.Schema;


const trashSchema = new Schema
({
    name:
    {
        type: String,
        required: true,
    },
    value:
    {
        type: Number,
        required: true,
    },
    quantity:
    {
        type: Number,
        required: true,
    },
    type:
    {
        type: String,
        enum: ["Zestaw Catering", "Sałatka", "Dodatki Skrobiowe", "Mięso", "Naleśniki", "Dodatek Mięsny"],
        required: true,
    },
    owner:
    {
        type: Schema.Types.ObjectId,
        ref: "users"
    }
});
const Trash = mongoose.model("trashes", trashSchema);
module.exports = Trash;