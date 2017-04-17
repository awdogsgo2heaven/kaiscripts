var AvatarKaiScript = require('../models/avatar-kai-script');
var AvatarItem = require('../models/avatar-item');
var consts = require('../config/constants');
var _ = require('underscore');
var sprintf = require('sprintf-js').sprintf;
var VersionError = require('mongoose/lib/error/version.js')
var method = MatchMakingService.prototype;

function MatchMakingService(options, socket) {
    var self = this;

	//self.battles = [];
}

method.add = function add(socket) {
	//self.battles.push(battle);
}

method.search = function add(socket) {
	//self.battles.push(battle);
}

module.exports = MatchMakingService;