/**
 * Get the servers current power state
 */
var supermicro = require('../lib/app');
var server = new supermicro.ipmi(require('./config'));

server.getCurrentPowerState(function(err, state) {
  if (err) {
    console.log(err.toString());
    return;
  }

  if (state == 1) {
    console.log('The server is currently online');
  } else {
    console.log('The server is currently offline');
  }
});
