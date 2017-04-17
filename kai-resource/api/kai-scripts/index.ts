import * as express from 'express';
import * as auth from '../../../lib/auth/auth.service';
import * as controller from './kai-scripts.controller';
import * as tracer from '../tracer';

var router = express.Router();

//Get all kaiscripts
router.get('/', auth.isAuthenticated(), tracer.trace(controller.all));

//Get a specific kaiscript
router.get('/:id', auth.isAuthenticated(), tracer.trace(controller.get));

//Get a kaiscript's stats
router.get('/:id/stats', auth.isAuthenticated(), tracer.trace(controller.stats));

//Rename a kaiscript
router.put('/:id/rename', auth.isAuthenticated(), tracer.trace(controller.rename));

//Get kaiscripts skills
router.get('/:id/skills', auth.isAuthenticated(), tracer.trace(controller.skills));

//Get a specific kaiscript skill
router.get('/:id/skills/:skill', auth.isAuthenticated(), tracer.trace(controller.getSkill));

//Get a list of hacks equipped
router.get('/:id/hacks', auth.isAuthenticated(), tracer.trace(controller.hacks));

//Get a list of hacks this kaiscript can equip
router.get('/:id/hacks/all', auth.isAuthenticated(), tracer.trace(controller.availableHacks));

//Add a hack
router.put('/:id/hacks/add/:hackId', auth.isAuthenticated(), tracer.trace(controller.addHack));

//Remove a hack
router.put('/:id/hacks/remove/:hackId', auth.isAuthenticated(), tracer.trace(controller.removeHack));

//Get a list of shaders equipped
router.get('/:id/shaders', auth.isAuthenticated(), tracer.trace(controller.shaders));

//Get all available shaders
router.get('/:id/shaders/all', auth.isAuthenticated(), tracer.trace(controller.availableShaders));

//Add a shader
router.put('/:id/shaders/add/:itemId', auth.isAuthenticated(), tracer.trace(controller.addShader));

//Remove a shader
router.put('/:id/shaders/remove/:itemId', auth.isAuthenticated(), tracer.trace(controller.removeShader));

//Use an item
router.put('/:id/items/use/:itemId', auth.isAuthenticated(), tracer.trace(controller.use));

//Drop an item
router.delete('/:id', auth.isAuthenticated(), tracer.trace(controller.destroy));

// router.post('/avatar', auth.isAuthenticated(), controller.avatar);
// router.post('/kaiscript', auth.isAuthenticated(), controller.avatar);
export = router;
