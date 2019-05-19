var mongoose=require('mongoose');
var cherriesSchema=require('../schemas/cherries');

module.exports = mongoose.model('Cherries',cherriesSchema);