// initializes app and start compilation
const comp = require('../compiler/build');
const logger = require('../compiler/logger');

logger('\n === START APPLICATION === \n', 'FgCyan');
comp.compileTSC('./compiler/build.config.json');

// define variables
var app, server;

// run server first
startServer();

// run watch
comp.TSCW(__dirname + '/../src/server/',function(){
    stopServer( function() {
        //logger('\n === Rebuilding === \n', 'FgGreen');
        //comp.compileTSC('./compiler/build.config.json');
        //startServer();

        console.log('end stop server');
    });
});

function startServer(){
    server = 0;
    server = require('../lib/server');
    server.httpServer.AddStatic(__dirname + '/public');
    server.mongoServer.mongoURI = 'mongodb://localhost/test';
    server.httpServer.Listen();
}

function stopServer(callback){
    server.httpServer.Stop();
    server.httpServer.Destroy();

    /*
    setTimeout(function(){
        console.log('calling callback');
        delete require.cache[require.resolve('../lib/server')];        
        if (callback) callback;        
    }, 1500);
    */
}