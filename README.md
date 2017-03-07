deepstream.io-msg-zmq
======================

A [deepstream.io](http://deepstream.io/) message connector for [ZeroMQ](http://zeromq.org/)
This connector uses [the npm zmq package](https://www.npmjs.com/package/zmq). Please have a look there for detailed options.

##Basic Setup

```yaml
plugins:
  message:
    name: zmq
    options:
      address: 'tcp://127.0.0.1:3001',
      peers:
        - 'tcp://127.0.0.1:3002'
        - 'tcp://127.0.0.1:3003'
```

```javascript
var Deepstream = require('deepstream.io'),
    ZMQConnector = require('deepstream.io-msg-zmq'),
    server = new Deepstream();

server.set('messageConnector', new ZMQConnector({
  address: 'tcp://127.0.0.1:3001',
  peers: ['tcp://127.0.0.1:3002']
}));

server.start();
```

```javascript
var DeepstreamServer = require('deepstream.io')

var server = new DeepstreamServer({
  host: 'localhost',
  port: 6020,
  plugins: {
    message: {
        name: 'zmq',
        options: {
            address: 'tcp://127.0.0.1:3001',
            peers: ['tcp://127.0.0.1:3002']
        }
    }
  }
})
```
