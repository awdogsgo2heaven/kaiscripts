import * as express from 'express';
import * as auth from '../../../lib/auth/auth.service';
import * as controller from './shop.controller';
import * as tracer from '../tracer';

var router = express.Router();

//Get a list of items to buy
router.get('/', auth.isAuthenticated(), tracer.trace(controller.all));

router.get('/detail/:itemId', auth.isAuthenticated(), tracer.trace(controller.get));
//Buy an item
router.put('/buy/:itemId', auth.isAuthenticated(), tracer.trace(controller.buy));

//Sell an item
router.put('/sell/:itemId', auth.isAuthenticated(), tracer.trace(controller.sell));


export = router;
