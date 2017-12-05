

// initializes app and start compilation
const comp = require('../compiler/build');
const logger = require('../compiler/logger');

logger('\n === START APPLICATION === \n', 'FgCyan');
comp.compileTSC('./compiler/build.config.json');

// define variables
var app, server;

// run server first
startServer(() => {
    logger('\n Waiting ...', 'FgGreen');
    /* ------------------------------ */
    /*
    
    setTimeout(() => {
        logger('done! \n', 'FgGreen');
    }, 1500);
    */
});


function startServer(callback){
    server = require('../lib/server');
    server.httpServer.AddStatic(__dirname + '/public');
    server.mongoServer.mongoURI = 'mongodb://localhost/test';
    server.httpServer.Listen(callback);
}