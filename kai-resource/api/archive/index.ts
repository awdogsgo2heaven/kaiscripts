import * as express from 'express';
import * as auth from '../../../lib/auth/auth.service';
import * as controller from './archive.controller';
import * as tracer from '../tracer';

var router = express.Router();

//List monsters seen
router.get('/journal', auth.isAuthenticated(), tracer.trace(controller.journal));

//List battle log
router.get('/factions', auth.isAuthenticated(), tracer.trace(controller.factions));

router.get('/rank', auth.isAuthenticated(), tracer.trace(controller.rank));

//List achievements
router.get('/achievements', auth.isAuthenticated(), controller.achievements);

//List faction status
router.get('/faction', auth.isAuthenticated(), controller.faction);

export = router;
