# TNEMA

STILL ON WORKING...NOT FULLY FUNCTIONAL YET.

Server Bundle with: TypeScript + Node + Express + MongoDB + Authentication
Requires TypeScript

`npm install typescript`

## Install

`npm install tnema --save`

## Usage

To start a server with static routing on './public':

```js
tnema = require('./index');
server = new tnema.TNEMAServer;
server.port(3000);
server.mongoURI('mongodb://localhost/test');
server.HttpServer.AddStatic(__dirname + '/public');
server.Create(function(){
    console.log('Server started at port: 3000');
});