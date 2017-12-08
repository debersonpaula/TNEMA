# TNEMA

STILL ON WORKING...NOT FUNCTIONAL YET.

Server Bundle with: TypeScript + Node + Express + MongoDB + Authentication
Requires TypeScript

`npm install typescript --save-dev`

## Install

`npm install tnema --save`

## Usage

To start a server with static routing on './public':

```
const app = require('tnema');
const server = app.createServer();

server.httpServer.AddStatic('./public');
server.httpServer.Listen();
```

To compile TypeScript based on config file:

```
const app = require('tnema');
app.tools.compileTSC('config file');
```


To compile TypeScript based on config file and watch for any changes:

```
const app = require('tnema');
app.tools.compileTSCW('config file','watch dir');
```