var fs = require('fs');
var path = require('path');

var models = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
  return (file.indexOf('.') !== 0) && ((file !== 'index.js') && (file !== 'virus.js')) && (file !== 'schemas') && (file.indexOf('.map') == -1) && (file.indexOf('.ts') == -1);
})
  .forEach(function(file) {
  var model = require(path.join(__dirname, file));
  models[model.default.toSymbol()] = model.default;
});
export = models;
