import * as express from 'express';
import * as auth from '../../../lib/auth/auth.service';
import * as controller from './items.controller';
import * as tracer from '../tracer';

var router = express.Router();

//Get all user items
router.get('/', auth.isAuthenticated(), tracer.trace(controller.all));

//Get an individual item info
router.get('/:id', auth.isAuthenticated(), tracer.trace(controller.get));

//Encrypt an item
router.put('/encrypt/:id', auth.isAuthenticated(), tracer.trace(controller.encrypt));

//Decrypt an item
router.put('/decrypt/:id', auth.isAuthenticated(), tracer.trace(controller.decrypt));

//Drop an item
router.delete('/:id', auth.isAuthenticated(), tracer.trace(controller.destroy));

//Cache item
router.put('/cache/:id', auth.isAuthenticated(), tracer.trace(controller.addCache));

//Remove item
router.delete('/cache/:id', auth.isAuthenticated(), tracer.trace(controller.removeCache));

export = router;
