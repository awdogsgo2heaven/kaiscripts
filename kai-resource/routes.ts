var controller = require('./api/account/account.controller')

export default function routes(app) {
  // Insert routes below
    
  app.use('/verify/:id', controller.verify);
  app.use('/api/account', require('./api/account'));
  app.use('/api/lore', require('./api/lore'));
  app.use('/api/archive', require('./api/archive'));
  app.use('/api/discovery', require('./api/discovery'));
  app.use('/api/items', require('./api/items'));
  app.use('/api/team', require('./api/team'));
  app.use('/api/shop', require('./api/shop'));
  app.use('/api/kai-scripts', require('./api/kai-scripts'));
};
