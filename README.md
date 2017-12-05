# TNEMA

ON WORKING...

Server Module with: TypeScript + Node + Express + MongoDB + Authentication

Requires TypeScript

`npm install typescript --save-dev`

## Install

`npm install tnema --save`

## Usage

To start a server with static routing on './public':

```
const app = require('tnemserver');
const server = app.createServer();

server.httpServer.AddStatic('./public');
server.httpServer.Listen();
```

To compile TypeScript based on config file:

```
const app = require('tnemserver');
app.tools.compileTSC('config file');
```


To compile TypeScript based on config file and watch for any changes:

```
const app = require('tnemserver');
app.tools.compileTSCW('config file','watch dir');
```