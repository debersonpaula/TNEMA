const logger = require('./compiler/logger');
const comp = require('./compiler/build');

// run first
startServer();

/************************************************************/
/************************************************************/
/************************************************************/
function startServer(){
    /*---------------------------------------------*/
    logger('==================================================================', 'FgBlue');
    logger('=== START COMPILATION ===', 'FgCyan');
    comp.compileTSC(__dirname + '/tsconfig.json');

    /*---------------------------------------------*/
    logger('=== START SERVER ===', 'FgCyan');
    var nema = require('./lib/main');
    server = new nema.TNEMAServer;
    server.port(3000);
    server.mongoURI('mongodb://localhost/test');
    server.HttpServer.AddStatic(__dirname + '/test/public');
    
    /*---------------------------------------------*/
    logger('=== CREATE APPLICATION ===', 'FgCyan');
    server.Create(function(){
        logger('=== READY ===', 'FgGreen');
        runWatch();
    });
}

function runWatch(){
    /*---------------------------------------------*/
    logger('=== RUNNING WATCH ===', 'FgCyan');
    var watcher = comp.TSCW(__dirname + '/src/server/',function(){
        logger('Rebuild...', 'FgGreen');
        watcher.close();
        stopServer();
    });
}


function stopServer() {
    /*---------------------------------------------*/
    logger('=== STOPPING SERVER ===', 'FgCyan');
    server.Destroy(function(){
        // clear cache of server component
        logger('Clear cache of server component', 'FgBlue');
        delete require.cache[require.resolve('./lib/main')];
        // restart server
        startServer();
    });
}