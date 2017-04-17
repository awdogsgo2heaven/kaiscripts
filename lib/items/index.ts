import Item from './item';

var fs = require('fs');
var path = require('path');

var attacks: { [key: string]: typeof Item; } = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && ((file !== 'index.js') && (file !== 'item.js')) && (file !== 'schemas') && (file.indexOf('.map') == -1) && (file.indexOf('.ts') == -1);
  }).forEach(function(file) {
    var model = require(path.join(__dirname, file));
    attacks[model.default.toSymbol()] = model.default;
  });

export = attacks
