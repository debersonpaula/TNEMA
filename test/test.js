const app = require('./index');

//app.tools.compileTSC('./compiler/build.config.json');
//app.tools.compileTSCW('./compiler/build.config.json','./src/server/');

// To start a server with static routing on './test'
const server = app.createServer();
server.httpServer.AddStatic('./test');
server.httpServer.Listen();
