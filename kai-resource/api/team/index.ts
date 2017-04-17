import * as express from 'express';
import * as auth from '../../../lib/auth/auth.service';
import * as controller from './team.controller';
import * as tracer from '../tracer';
var router = express.Router();

//Get team
router.get('/', auth.isAuthenticated(), tracer.trace(controller.all));

//Rename team
router.put('/rename', auth.isAuthenticated(), tracer.trace(controller.rename));

//Reorder team
router.put('/reorder', auth.isAuthenticated(), tracer.trace(controller.reorder));

//Add remove from team
router.put('/add/:id', auth.isAuthenticated(), tracer.trace(controller.add));

//Remove from team
router.put('/remove/:id', auth.isAuthenticated(), tracer.trace(controller.remove));

export = router;
