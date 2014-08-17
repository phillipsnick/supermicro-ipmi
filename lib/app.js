var request = require('request')
  , parseString = require('xml2js').parseString;

/**
 * Setup the IPMI options
 *
 * @param   options
 */
function ipmi(options) {
  if (typeof options.host === "undefined") {
    throw "Please define a host";
  }

  if (typeof options.username === "undefined") {
    throw "Please define a username";
  }

  if (typeof options.password === "undefined") {
    throw "Please define a password";
  }

  this.options = options;
  this.jar = request.jar();
}

exports.ipmi = ipmi;

/**
 * Define the power actions
 */
exports.powerAction = {
  RESET: 3,
  OFF_IMMEDIATE: 0,
  OFF_ORDERLY: 5,
  ON: 1,
  CYCLE: 2
}

/**
 * Get the full host address including port number
 *
 * @return  strin
 */
ipmi.prototype.getHostAddress = function() {
  return "http://" + this.options.host + ':' + this.options.port + '/';
}

/**
 * Get the current power state
 *
 * @param   function    callback
 */
ipmi.prototype.getCurrentPowerState = function(callback) {
  var self = this;

  this.login(function(err) {
    if (err) {
      callback(err);
      return;
    }

    request.get({
      jar: self.jar,
      url: self.getHostAddress() + 'cgi/ipmi.cgi?POWER_INFO.XML=(0,0)'
    }, function (err, res, body) {
      if (err) {
        callback(new Error('Unable to fetch power status'));
        return;
      }

      parseString(body, function (err, result) {
        if (err) {
          callback(new Error('Unable to parse XML response from IPMI server'));
          return;
        }

        //TODO: check result?

        callback(null, result.IPMI.POWER_INFO[0].POWER[0].$.STATUS == 'OFF' ? 0 : 1);
      });
    })
  });
}

/**
 * Perform a power action on the server
 *
 * @param   string    action
 * @param   function  callback
 */
ipmi.prototype.setPowerAction = function(action, callback) {
  var self = this;

  // TODO: check valid action

  this.login(function(err) {
    if (err) {
      callback(err);
      return;
    }

    request.get({
      jar: self.jar,
      url: self.getHostAddress() + 'cgi/ipmi.cgi?POWER_INFO.XML=(1,' + action + ')'
    }, function(err, res, body) {
      if (err) {
        callback(new Error('Unable to perform power action'));
        return;
      }

      callback();
    });
  });
}

/**
 * Get the sensor data
 *
 * @param   function  callback
 */
ipmi.prototype.getSensorData = function(callback) {
  var self = this;

  this.login(function() {
    //url: self.getHostAddress() + 'cgi/ipmi.cgi?POWER_INFO.XML=0'
    //cgi/ipmi.cgi?SENSOR_INFO_FOR_SYS_HEALTH.XML=(1%2Cff)
  });
}

/**
 * Perform a login before making the request
 *
 * @param   function  callback
 */
ipmi.prototype.login = function(callback) {
  request.post({
    jar: this.jar,
    url: this.getHostAddress() + 'cgi/login.cgi',
    headers: {
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    form: {
      name: this.options.username,
      pwd: this.options.password
    }
  }, function(err, res, body) {
    if (err) {
      callback(err);
    }

    // not the most perfect way of checking if we logged in, but if the login failed the
    // body will contain
    //   <META HTTP-EQUIV="refresh" CONTENT="0;URL=/">
    if (body.indexOf('<META HTTP-EQUIV="refresh" CONTENT="0;URL=/">') !== -1) {
      callback(new Error('Unable to authenticate'));
      return;
    }

    callback();
  });
}