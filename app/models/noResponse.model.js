const mongoose = require('mongoose');

const NoResponseSchema = mongoose.Schema({
    binNumber : String,
    imeiNo : Number
},{
    timestamps : true
});

module.exports = mongoose.model('NoResponse',NoResponseSchema);