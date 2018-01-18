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
    server.MongoSource = 'mongodb://127.0.0.1/test';

    // add static route to public folder
    server.HttpServer.RouteStatic(__dirname + '/test/public');

    // add route to /test and send the content
    server.HttpServer.App.get('/test', (req, res) => {
        res.send('Test Sucessfully');
    });

    // add route to /test and send the content
    server.HttpServer.App.get('/auth', server.AuthServer.AuthRoute, (req, res) => {
        res.send('Auth Sucessfully');
    });

    // custom schema and options
    server.AuthServer.OverwriteSchemas([
        new tnema.TSchema('dbUsers' ,{
            username: {
                type: String,
                default: '',
                required: [true,'UserName is required'],
                unique: [true,'This UserName already exists']
            },
            userpass: {
                type: String,
                default: '',
                required: [true,'Password is required'],
            },
            firstname: {
                type: String,
                default: '',
                required: [true, 'First name of user is required']
            },
            lastname: {
                type: String,
                default: '',
                required: [true, 'Last name of user is required']
            }
        })
    ]);

    server.AuthServer.OverwriteOptions({
        sessionInfo: ['_id','username','firstname','lastname']
    });
    
    
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