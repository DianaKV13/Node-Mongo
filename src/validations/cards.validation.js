const Joi = require('joi');


const image = Joi.object({ url: Joi.string().uri().allow(''), alt: Joi.string().allow('') }).required();
const address = Joi.object({ country: Joi.string().required(), city: Joi.string().required(), street: Joi.string().required(), houseNumber: Joi.number().integer().required(), zip: Joi.string().allow('') }).required();


const createCardSchema = Joi.object({
title: Joi.string().required(),
subtitle: Joi.string().allow(''),
description: Joi.string().allow(''),
phone: Joi.string().allow(''),
email: Joi.string().email().allow(''),
web: Joi.string().uri().allow(''),
image,
address,
bizNumber: Joi.number().integer().required()
});


const updateCardSchema = Joi.object({
title: Joi.string(),
subtitle: Joi.string().allow(''),
description: Joi.string().allow(''),
phone: Joi.string().allow(''),
email: Joi.string().email().allow(''),
web: Joi.string().uri().allow(''),
image: Joi.object({ url: Joi.string().uri().allow(''), alt: Joi.string().allow('') }),
address: Joi.object({ country: Joi.string(), city: Joi.string(), street: Joi.string(), houseNumber: Joi.number().integer(), zip: Joi.string().allow('') }),
bizNumber: Joi.number().integer()
});


module.exports = { createCardSchema, updateCardSchema };