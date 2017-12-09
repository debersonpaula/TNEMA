const logger = require("debugtxt");
const decache = require('decache');
const comp = require("tscbuilder");


// declare vars
var tnema = require('./lib/main');
var server;

// run first
startServer();

/************************************************************/
/************************************************************/
/************************************************************/
function startServer(){
    /*---------------------------------------------*/
    logger.writelnR('!FgBlue','==================================================================');
    logger.writelnR('!FgCyan','=== START COMPILATION ===');
    comp.CompileTSC(__dirname + '/tsconfig.json');

    /*---------------------------------------------*/
    logger.writelnR('!FgCyan','=== START SERVER ===');
    tnema = require('./lib/main');
    server = new tnema.TNEMAServer;
    server.port(3000);
    server.mongoURI('mongodb://localhost/test');
    server.HttpServer.AddStatic(__dirname + '/test/public');
    
    /*---------------------------------------------*/
    logger.writelnR('!FgCyan','=== CREATE APPLICATION ===');
    server.Create(function(){
        logger.writelnR('!FgGreen','=== READY ===');
        runWatch();
    });
}
/************************************************************/
/************************************************************/
/************************************************************/
function runWatch(){
    /*---------------------------------------------*/
    logger.writelnR('!FgCyan','=== RUNNING WATCH ===');
    var watcher = comp.Watcher(__dirname + '/src/server/',function(){
        logger.writelnR('!FgGreen','Rebuild');
        watcher.close();
        stopServer();
    });
}
/************************************************************/
/************************************************************/
/************************************************************/
function stopServer() {
    /*---------------------------------------------*/
    logger.writelnR('!FgCyan','=== STOPPING SERVER ===');
    server.Destroy(function(){

        // clear cache of server component
        logger.writelnR('!FgBlue','Clear cache of server component');
        decache('./lib/main');
        tnema = undefined;
        server = undefined;

        // restart server
        logger.writelnR('!FgCyan','\nRestarting server...');
        setTimeout(() => {
            startServer();    
        }, 3000);
    });
}
/************************************************************/
/************************************************************/
/************************************************************/