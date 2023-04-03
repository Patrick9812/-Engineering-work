const Joi = require("joi");
const prodSchema = Joi.object(
{
    email: Joi.string().required().min(3).max(60)
    .messages
    ({ 
        "string.min": "Email musi być dłuższa niż 3 znaki",
        "string.email": "Nieprawidłowy adres e-mail",
        "string.max": "Email musi być krótszy niż 60 znaków",
        "string.required": "Email powinien nie być pusty",
    }),
    password: Joi.string().required().pattern(/^[AaĄąBbCcĆćDdEeĘęFfGgHhIiJjKkLlŁłMmNnŃńOoÓóPpRrSsŚśTtUuWwYyZzŹźŻż1-9]+$/).min(11).max(40).messages
    ({ 
        "string-pattern": "Nieprawidłowy format hasła",
        "string.min": "Hasło musi być dłuższe niż 11 znaków",
        "string.max": "Hasło musi być krótsze niż 40 znaków",
        "string.required": "Email powinien nie być pusty",
    }),
    first: Joi.string().min(3).max(30).pattern(/^[AaĄąBbCcĆćDdEeĘęFfGgHhIiJjKkLlŁłMmNnŃńOoÓóPpRrSsŚśTtUuWwYyZzŹźŻż]+$/).required().messages
    ({
        "string.min": "Nazwa musi być dłuższa niż 3 znaki",
        "string.max": "Imię musi być krótsze niż 30 znaków",
        "string-pattern": "Imię musi zawierać tylko litery",
        "string.required": "Email powinien nie być pusty",
    }),
    sec: Joi.string().min(3).max(30).pattern(/^[AaĄąBbCcĆćDdEeĘęFfGgHhIiJjKkLlŁłMmNnŃńOoÓóPpRrSsŚśTtUuWwYyZzŹźŻż]+$/).required().messages
    ({
        "string.min": "Nazwisko musi być dłuższe niż 3 znaki",
        "string.max": "Nazwisko musi być krótsze niż 30 znaków",
        "string-pattern": "Nazwisko musi zawierać tylko litery",
        "string.required": "Nazwisko nie powinno być puste",
    })
    
})
module.exports = prodSchema;