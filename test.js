const logger = require("debugtxt");
const decache = require('decache');
const comp = require("tscbuilder");


// declare vars
var tnema;
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
    tnema = require('./index');
    server = new tnema.TNEMAServer('appTest','./appSessions.json');

    // define port
    server.Port = 3000;

    // define the source of mongodb
    server.MongoSource = 'mongodb://localhost/test';

    // add static route to public folder
    server.HttpServer.RouteStatic(__dirname + '/test/public');

    // add route to /test and send the content
    server.HttpServer.RouteSendContent('/test','Test Sucessfully');
    
    /*---------------------------------------------*/
    logger.writelnR('!FgGreen','=== CREATE APPLICATION ===');
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
        decache('./index');
        tnema = undefined;
        server = undefined;

        // restart server
        logger.writelnR('!FgCyan','\nRestarting server...');
        setTimeout(() => {
            startServer();    
        }, 500);
    });
}
/************************************************************/
/************************************************************/
/************************************************************/