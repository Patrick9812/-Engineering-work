const { object } = require("joi");
const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
mongoose.set('strictQuery', false);
const userSchema = new Schema
({
    email:
    {
        type: String,
        required: true
    },
    password:
    {
        type: String,
        required: true
    },
    first:
    {
        type: Object,
    },
    sec:
    {
        type: Object,
    },
    isAdmin:
    {
        type: Boolean,
        required: true,
        default: false,
    },
})
const User = mongoose.model("users", userSchema);
module.exports = User;
