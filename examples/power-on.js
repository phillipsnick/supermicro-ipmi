/**
 * Get the servers current power state
 */
var supermicro = require('../lib/app');
var server = new supermicro.ipmi(require('./config'));

server.setPowerAction(supermicro.powerAction.ON, function(err) {
  if (err) {
    console.log(err.toString());
    return;
  }

  console.log('Successfully sent request to power server on');
});
