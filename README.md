# TNEMA

Server Bundle with: TypeScript + Node + Express + MongoDB + Authentication

[![NPM](https://nodei.co/npm/tnema.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/tnema)

Work Progress:

 - Core functionalities: done
 - Http Server: done
 - MongoDB Server: done
 - Authentication Server: done
 - Security: working

## Requirements

``` bash
# if you are running thru TypeScript, install it before:
npm install typescript

# also requires @types
npm install @types/body-parser @types/express @types/express-session @types/mongoose
```

Also requires an instance of MongoDB running.

## Install

``` bash
# install TNEMA Server
npm install tnema --save
```

## Usage

To start a server with static routing on './public':

```js
  tnema = require('tnema');
  
  // create server instance with session-name and secret-string
  server = new tnema.TNEMAServer('session-name','secret-string');
  
  // define port
  server.Port(3000);
  
  // define the source of mongodb
  server.MongoSource('mongodb://localhost/test');
  
  // add static route to public folder
  server.HttpServer.RouteStatic(__dirname + '/public');

  // add route to /test and send the content
    server.HttpServer.RouteSendContent('/test','Test Sucessfully');
  
  // start server
  server.Create(function(){
    console.log('Server started at port: 3000');
  });
```

## License

  [MIT](LICENSE)