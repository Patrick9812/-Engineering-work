const Joi = require("joi");
const orderSchema = Joi.object(
{
    date: Joi.string()
    .required()
    .min(4)
    .isoDate()
    .messages
    ({ 
        "string.isoDate": "Musisz podać datę",
        "string.min": "Data musi być dłuższa niż 4 znaki",
        "string.required": "data nie może być pusta",
    }),
    promocja: Joi.string().allow(null, '').optional(),
    miasto: Joi.string().min(2).pattern(/^[AaĄąBbCcĆćDdEeĘęFfGgHhIiJjKkLlŁłMmNnŃńOoÓóPpRrSsŚśTtUuWwYyZzŹźŻż ]+$/).max(32).messages
    ({ 
        "string.min": "Miasto musi być dłuższe niż 4 znaki",
        "string.max": "Miasto musi być któtsze niż 32 znaki",
    }),
    code: Joi.string().length(6).messages({
        "string.length": "Kod pocztowy musi mieć 6 znaków",
    }),
    adres: Joi.string().min(3).max(56)
    .messages({
        "string.min": "Ulica musi być dłuższa niż 3 znaki",
        "string.max": "Ulica musi być któtsza niż 56 znaki",
        "string.pattern": "Użytko niewłaściwych znaków",
    }),
    tel: Joi.string().length(9).required().pattern(/^[0-9]+$/).messages({
        "string.length": "Telefon musi mieć 9 liczb",
        "string.pattern": "Telefon musi zawierać tylko cyfry",
        "string.type": "Nieprawidłowy format telefonu",
        "string.required": "Telefon nie może być pusty",
    }),
    house: Joi.string().min(1).alphanum().pattern(/^[AaĄąBbCcĆćDdEeĘęFfGgHhIiJjKkLlŁłMmNnŃńOoÓóPpRrSsŚśTtUuWwYyZzŹźŻż1-9 /]+$/).max(7).messages
    ({
        "string.min": "Numer domu musi być dłuższy niż 1 znak",
        "string.max": "Numer domu musi być krótszy niż 7 znaków",
        "string.alphanum": "Nieprawidłowy format numeru domu",
    }),
    payMethod: Joi.string().valid("paypal", "gotówka").messages
    ({
        "string.valid": "Niewłaściwa płatność zamówienia",
    })
})
module.exports = orderSchema;
