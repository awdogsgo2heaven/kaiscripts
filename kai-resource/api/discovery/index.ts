import * as express from 'express';
import * as auth from '../../../lib/auth/auth.service';
import * as controller from './discovery.controller';
import * as tracer from '../tracer';

var router = express.Router();

//Scan a barcode
router.post('/barcode', auth.isAuthenticated(), tracer.trace(controller.barcode));

router.get('/map/:x/:y/', auth.isAuthenticated(), tracer.trace(controller.map));

router.get('/test/:x/:y/', auth.isAuthenticated(), tracer.trace(controller.test));

//Fuse two kaiscripts
router.post('/fuse', auth.isAuthenticated(), tracer.trace(controller.fuse));
//Search area for monsters or items

router.post('/home', auth.isAuthenticated(), tracer.trace(controller.home));

router.post('/take/:x/:y/', auth.isAuthenticated(), tracer.trace(controller.take));

router.get('/result/:id', auth.isAuthenticated(), tracer.trace(controller.result));

router.post('/join/:id', auth.isAuthenticated(), tracer.trace(controller.join));

export = router;
