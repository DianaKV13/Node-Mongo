const Joi = require('joi');


const name = Joi.object({ first: Joi.string().required(), last: Joi.string().required() }).required();
const image = Joi.object({ url: Joi.string().uri().allow(''), alt: Joi.string().allow('') }).required();
const address = Joi.object({ country: Joi.string().required(), city: Joi.string().required(), street: Joi.string().required(), houseNumber: Joi.number().integer().required(), zip: Joi.string().allow('') }).required();


const registerSchema = Joi.object({
name,
email: Joi.string().email().required(),
password: Joi.string().min(6).required(),
image,
address,
isBusiness: Joi.boolean().optional()
});


const loginSchema = Joi.object({
email: Joi.string().email().required(),
password: Joi.string().required()
});


const updateSchema = Joi.object({
name: Joi.object({ first: Joi.string(), last: Joi.string() }),
email: Joi.string().email(),
password: Joi.string().min(6),
image: Joi.object({ url: Joi.string().uri().allow(''), alt: Joi.string().allow('') }),
address: Joi.object({ country: Joi.string(), city: Joi.string(), street: Joi.string(), houseNumber: Joi.number().integer(), zip: Joi.string().allow('') }),
isBusiness: Joi.boolean()
});


module.exports = { registerSchema, loginSchema, updateSchema };