const mongoose = require('mongoose');

const BinNSchema = mongoose.Schema({
    binNumber: String,
    imei_tcu : Number
});

module.exports = mongoose.model('BinN', BinNSchema,'binN_news');
