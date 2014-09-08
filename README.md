# Supermicro IPMI 

Simple module for accessing and controlling the IPMI interface on Supermicro motherboards. 

## Installation

```
npm install supermicro-ipmi
```

  
## Usage

First create an instance
 
```javascript
var ipmi = require('supermicro-ipmi');

var server1 = new ipmi({
  host: '', // IP Address/Hostname
  port: 80,
  username: 'ADMIN',
  password: 'ADMIN'
});
```


## Methods

### getHostAddress()

Basic method to construct the URL for HTTP request

__Example__

```js
console.log(server1.getHostAddress());

// example output: http://192.168.0.10:80/
```

---------------------------------------

### login(callback)

Method to prevent code duplication of the login process required when performing actions via HTTP.

__Arguments__

* `callback(err)` - Action to perform once the login request has been made

__Example__

```js
server1.login(function(err) {
  if (err) {
    callback(err);
    return;
  }

  console.log('We are successfully logged in');
});
```

---------------------------------------

### getCurrentPowerState(callback)

Get the current power state of the host.

__Arguments__

* `callback(err, powerState)` - Callback function for error/response handling

__Example__

```js
server1.getCurrentPowerState(function(err, state) {
  if (err) {
    console.log(err);
    return;
  }

  if (state == 1) {
    console.log('The server is currently online');
  } else {
    console.log('The server is currently offline');
  }
});
```

---------------------------------------

### setPowerAction(powerAction, callback)

Perform a power action on the server

__Arguments__

* `powerAction` - Integer containing the power action to perform, see the table below for valid options
* `callback(err)` - Callback function for error/success handling

All power actions are available within `supermicro.powerAction` object.

|State|powerAction|
|-----|-----------|
|3|RESET|
|0|OFF_IMMEDIATE|
|5|OFF_ORDERLY|
|1|ON|
|2|CYCLE|

__Example__

```js
server1.setPowerAction(supermicro.powerAction.ON, function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Successfully sent request to power server on');
});

```
  
## Notes

No doubt there are better ways to achieve this but without spending a considerable amount of time looking for alternatives I have simply reverse engineered the web GUI and made it into a module.

Not 100% sure if this will work on all versions of the Supermicro IPMI implementation, only been tested on my X9SCM-F board.


## Licence

[The MIT License (MIT)](https://github.com/phillipsnick/supermicro-ipmi/blob/master/LICENCE)
