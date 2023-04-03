const Joi = require("joi");
const mealSchema = Joi.object(
{
    ready: Joi.string().required().valid("Tak", "Nie").length(3)
    .messages
    ({ 
        "string.length": "Gotowość  zamówienia musi być równa 3 znaki",
        "string.valid": "Nieprawidłowy stan",
        "string.required": "Gotowość zamówienia nie powinno być pusta",
    }),
    payed: Joi.string().required().valid("Tak", "Nie").length(3)
    .messages
    ({ 
        "string.length": "Płatność musi być równa 3 znaki",
        "string.valid": "Nieprawidłowy stan",
        "string.required": "Płatność zamówienia nie powinna być pusta",
    }),
    method: Joi.string().required().valid("Odbiór osobisty", "Dostawa").min(6).max(20)
    .messages
    ({ 
        "string.min": "Płatność musi mieć więcej niż 6 znaków",
        "string.max": "Płatność musi mieć mniej niż 20 znaków",
        "string.valid": "Nieprawidłowy stan",
        "string.required": "Płatność zamówienia nie powinna być pusta",
    }),
    
    
})
module.exports = mealSchema;