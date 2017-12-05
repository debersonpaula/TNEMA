// initializes app and start compilation
const comp = require('../compiler/build');
comp.compileTSC('./compiler/build.config.json');

// define variables
var app, server;

// run server first
startServer();

// run watch
comp.TSCW(__dirname + '/../src/server/',function(){
    stopServer();
    console.log('Rebuilding...');
    comp.compileTSC('./compiler/build.config.json');
    startServer();
});

function startServer(){
    server = require('../lib/server');
    server.httpServer.AddStatic(__dirname + '/public');
    server.mongoServer.mongoURI = 'mongodb://localhost/test';
    server.httpServer.Listen();
}

function stopServer(){
    server.httpServer.Destroy();
    delete require.cache[require.resolve('../lib/server')];
}