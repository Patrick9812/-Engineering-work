const Joi = require("joi");
const prodSchema = Joi.object(
{
    name: Joi.string()
    .required()
    .min(4)
    .max(100)
    .messages
    ({ 
        "string.min": "Nazwa musi być dłuższa niż 3 znaki",
        "string.max": "Nazwa musi być krótsza niż 40 znaków",
        "string.required": "Nazwa powinna nie być pusta",
    }),
    value: Joi.number()
    .min(0)
    .max(1500)
    .messages
    ({
        'number': "Cena musi być liczbą",
        'number.min': `Cena powinna być większa od {#limit}`,
        'number.max': `Cena powinna być mniejsza od {#limit}`,
        'number.empty': `Cena nie powinna być pusta`,
        'any.required': 'Pole cena jest wymagane'
    }),
    
    type: Joi.string()
    .valid('Zestaw Catering', 'Sałatka', 'Dodatki Skrobiowe', 'Mięso', 'Naleśniki', 'Dodatek Mięsny')
    .required(),
            
    details: Joi.string()
    .required()
    .max(250)
    .min(1)
    .messages
    ({ 
            "string.max": "Przekroczyłeś limit znaków w polu 'Detale'",
            "string.required":"Pole 'Detale' powinno mieć zawartść"
    }),
})
module.exports = prodSchema;