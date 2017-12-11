# TNEMA

Server Bundle with: TypeScript + Node + Express + MongoDB + Authentication

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
 
# install TNEMA Server
npm install tnema --save
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
  tnema = require('./index');
  server = new tnema.TNEMAServer;
  
  // define port
  server.port(3000);
  
  // define the source of mongodb
  server.mongoURI('mongodb://localhost/test');
  
  // add static route to public folder
  server.HttpServer.AddStatic(__dirname + '/public');
  
  // start server
  server.Create(function(){
    console.log('Server started at port: 3000');
  });
```
