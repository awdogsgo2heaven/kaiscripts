import * as express from 'express';
import * as auth from '../../../lib/auth/auth.service';
import * as controller from './lore.controller';
import * as tracer from '../tracer';

const router = express.Router();

//Get a piece of lore by key
router.get('/:id', tracer.trace(controller.get));

export = router;
