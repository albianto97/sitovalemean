const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    notifyDate: { type: Date, required: true },
    message: {
        type: String,
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    }
});

const Notify = mongoose.model('Notify', notificationSchema);

module.exports = Notify;
