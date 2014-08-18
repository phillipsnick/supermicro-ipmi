# Supermicro IPMI 

Simple module for accessing and controlling the IPMI interface on Supermicro motherboards. 

## Installation

```
npm install supermicro-ipmi --save
```

  
## Usage

First create an instance
 
```javascript
var ipmi = require('supermicro-ipmi');

var server1 = new ipmi({
  host: 'IP Address/Hostname',
  port: 80,
  username: 'ADMIN',
  password: 'ADMIN'
});
```

All API methods currently use a callback to provide the response back to you.


### Methods

To fetch the count of outlets on the PDU.

```javascript
pdu.fetchTotalOutlets(function(err, totalOutlets) {
  if (err) {
    // optional error call back function
    // error variable provided as a object
    return;
  }
  // totalOutlets now contains an integer with the total number of outlets
});
```
  
To be continuned...

  
## Notes

No doubt there are better ways to achieve this but without spending a considerable amount of time looking for alternatives I have simply reverse engineered the web GUI and made it into a module.

Not 100% sure if this will work on all versions of the Supermicro IPMI implementation, only been tested on my X9SCM-F board.


## Licence

[The MIT License (MIT)](https://github.com/phillipsnick/supermicro-ipmi/blob/master/LICENSE)
