import * as express from 'express';
import * as auth from '../../../lib/auth/auth.service';
import * as controller from './account.controller';
import * as tracer from '../tracer';
var router = express.Router();

//Get current version - state of client
router.get('/client', tracer.trace(controller.client));

//Get terms of agreement
router.get('/terms-of-agreement', tracer.trace(controller.termsOfAgreement));

//Get privacy policy
router.get('/privacy-policy', tracer.trace(controller.privacyPolicy));

//Register
router.post('/register', tracer.trace(controller.register));

//Verify account
router.get('/verify/:id', tracer.trace(controller.verify));

//Re request verify code
router.get('/request-verify', auth.isAuthenticated(false), tracer.trace(controller.requestVerify));

//Remove current device 
router.delete('/device', auth.isAuthenticated(), tracer.trace(controller.removeDevice));

//Remove current device 
router.delete('/device/all', auth.isAuthenticated(), tracer.trace(controller.removeAllDevices));

//Create avatar
router.post('/create-avatar', auth.isAuthenticated(false), tracer.trace(controller.createAvatar));

//Create kaiscript
router.post('/create-starter', auth.isAuthenticated(false), tracer.trace(controller.createKaiScript));

//Change password
router.post('/change-password', auth.isAuthenticated(), tracer.trace(controller.changePassword));

export = router;
