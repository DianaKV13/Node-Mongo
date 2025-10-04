const mongoose = require('mongoose');


const nameSchema = new mongoose.Schema({ first: String, last: String }, { _id: false });
const imageSchema = new mongoose.Schema({ url: String, alt: String }, { _id: false });
const addressSchema = new mongoose.Schema({ country: String, city: String, street: String, houseNumber: Number, zip: String }, { _id: false });


const userSchema = new mongoose.Schema({
name: { type: nameSchema, required: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
image: { type: imageSchema, default: {} },
address: { type: addressSchema, default: {} },
isBusiness: { type: Boolean, default: false },
isAdmin: { type: Boolean, default: false },
bizNumber: { type: Number, unique: true, sparse: true },
failedLoginAttempts: { type: Number, default: 0 },
blockedUntil: { type: Date, default: null }
}, { timestamps: true });


userSchema.set('toJSON', {
transform: (doc, ret) => {
delete ret.password;
return ret;
}
});


module.exports = mongoose.model('User', userSchema);