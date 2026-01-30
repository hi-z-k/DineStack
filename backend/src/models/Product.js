const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true }, // e.g., Burgers, Drinks, Pizza
    image: { type: String }, // We'll store a URL to the image
    isAvailable: { type: Boolean, default: true }
});

module.exports = mongoose.model('Product', productSchema);