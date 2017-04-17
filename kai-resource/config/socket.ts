'use strict';

import {logger} from '../../lib/helpers/logger';
import * as consts from '../../lib/config/constants';
import * as _ from 'underscore';
import {KaiScriptService} from '../../lib/services/kai-scripts';
import {LocatorService} from '../../lib/services/locator';
import {Battles} from '../../lib/services/battle';
import {BadRequestError, NotFoundError} from '../../lib/errors';
import * as SocketIO from 'socket.io';
import {Account} from '../../lib/data/account';
import {BattleEvent} from '../../lib/data/battle-event';
import * as redis from '../../lib/data/redis';
import {COMMANDS} from '../../lib/objects/human-player';
import {PubSub} from '../../lib/data/pubsub';

// var onevent = socket.onevent;
// socket.onevent = function(packet) {
//   var args = packet.data || [];
//   onevent.call(this, packet);    // original call
//   packet.data = ["*"].concat(args);
//   onevent.call(this, packet);      // additional call to catch-all
// };

export function configure(io: SocketIO.Server) {

  function error(err) {
    logger.error(err);
  }

  function authenticate(gen, socket) {
    return async function(data) {
      try {
        var account = await Account.findByToken(socket.decoded_token.token);
        await gen(account, data);
      }
      catch (e) {
        logger.error(e);
        socket.emit('exception', e.toString());
      }
    }
  };
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  io.use(require('socketio-jwt').authorize({
    secret: process.env.JWT_SECRET,
    handshake: true
  }));

  io.on('connection', function(socket: SocketIO.Socket) {

    socket.address = socket.handshake.address !== null ?
      socket.handshake.address.address + ':' + socket.handshake.address.port :
      process.env.DOMAIN;


    Account.findByToken(socket.decoded_token.token).then(function(account) {
      //socket.user = account;
      PubSub.join(account.avatar.id, socket);

      socket.on('step', authenticate(async function(user, data) {
        console.log('step');
        const coords = { lon: data.lon, lat: data.lat, createdAt: Date.now() };
        const service = new LocatorService({ user: user }, io);

        const result = await service.step(coords);

        if (result) {
          const currentLocation = await user.getLastKnownLocation();
          var event = await BattleEvent.createRandomEvent(user.avatar, result.kaiScript, result.query);

          if(event) {
            var battle = Battles.createRandomBattle(event, io);
            battle.invite(user);

            io.in(user.avatar.id.toString()).emit('INVITATION', { id: event.id });
            io.in(user.avatar.id.toString()).emit('MESSAGE', `Infected ${result.kaiScript.name} found.`);
          }
        }
      }, socket));

      PubSub.addListener('BATTLE', COMMANDS.JOIN, account.avatar.id, authenticate(async function(user: Account, data) {
        if (data.id) {
          const isJoined = Battles.join(parseInt(data.id), user, io);
          if (!isJoined) {
            socket.emit('exception', 'Failed to join event');
          }
        }
      }, socket));

      //forward all battle related events to correct socket server
      for (const key of Object.keys(COMMANDS)) {
        const event = COMMANDS[key];
        PubSub.forward('BATTLE', event, account.avatar.id, socket);
      }

      socket.on('disconnect', authenticate(async function(user) {
        logger.error('disconnecting from this world');
        PubSub.publisher.publish(redis.key('BATTLE', 'q', account.avatar.id), '');
        PubSub.leave(socket.id)
        // return battleService.disconnect(socket.user.avatar.id).catch(function(e) {
        //   console.log(e);
        // });
      }, socket));


      socket.emit('connected');
    }).catch(function(exception) {
      logger.error(exception);
      socket.disconnect();
    });

    socket.on('error', function error(err) {
      logger.error(err);
    });

    socket.on('exception', function error(err) {
      logger.error(err);
    });
    // Call onDisconnect.



    // Call onConnect.
  });
};
