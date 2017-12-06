// initializes app and start compilation
const comp = require('./compiler/build');
const logger = require('./compiler/logger');

logger('\n === START COMPILATION === \n', 'FgCyan');
comp.compileTSC('./tsconfig.json');

// define variables
var server;

// run server first
startServer();

function startServer(){
    
    //server.httpServer.AddStatic(__dirname + '/public');
    //server.httpServer.httpPort = 3000;
    //server.mongoServer.mongoURI = 'mongodb://localhost/test';
    //server.httpServer.Listen(callback);

    /*---------------------------------------------*/
    logger('=== START APPLICATION === \n', 'FgCyan');
    server = require('./lib/main');
    server.HttpServer.httpPort = 3000;
    server.HttpServer.AddStatic(__dirname + '/public');
}