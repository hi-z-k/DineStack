const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'], 
        default: 'pending' 
    },
    deliveryAddress: { type: String, required: true },
    driver: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    orderedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);