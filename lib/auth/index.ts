'use strict';

import * as express from 'express';
import * as passport from 'passport';
import * as local from './local/passport';

// Passport Configuration
local.setup();

var router = express.Router();

router.use('/local', require('./local'));

export = router;
