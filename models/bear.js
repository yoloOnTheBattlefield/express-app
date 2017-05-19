var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BearSchema = new Schema({
    name: String,
    createdAt: new Date()
});

module.exports = mongoose.model('Bear', BearSchema);
