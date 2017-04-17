var pm2 = require('pm2');
var config = require('./bin/lib/config/env.json');
var instances = process.env.WEB_CONCURRENCY || 2; // Set by Heroku or -1 to scale to max cpu core -1
var maxMemory = process.env.WEB_MEMORY || 512;    // " " "

pm2.connect(function() {
  pm2.start({
    script: './bin/kai-resource/index.js',
    name: 'web-kaiscript',     // ----> THESE ATTRIBUTES ARE OPTIONAL:
    exec_mode: 'cluster',            // ----> https://github.com/Unitech/PM2/blob/master/ADVANCED_README.md#schema
    instances: instances,
    watch: true,
    env: config
  }, function(err) {
    if (err) return console.error('Error while launching applications', err.stack || err);
    console.log('PM2 and application has been succesfully started');

    // Display logs in standard output
    // pm2.launchBus(function(err, bus) {
    //   console.log('[PM2] Log streaming started');

    //   bus.on('log:out', function(packet) {
    //     console.log('[App:%s] %s', packet.process.name, packet.data);
    //   });

    //   bus.on('log:err', function(packet) {
    //     console.error('[App:%s][Err] %s', packet.process.name, packet.data);
    //   });
    // });

  });
});
