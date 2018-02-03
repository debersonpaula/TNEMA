const logger = require("debugtxt");

/*---------------------------------------------*/
logger.writelnR('!FgCyan','=== START SERVER ===');
var tnema = require('./index');
var server = new tnema.TNEMAServer('appTest','./appSessions.json');



// define port
server.Port = 3000;
// maxage = days * hours * minutes * seconds * ms
server.Options.maxAge = 30 * 24 * 60 * 60 * 1000;

// define the source of mongodb
server.MongoSource = 'mongodb://127.0.0.1/test';

// add static route to public folder
server.RouteStatic = __dirname + '/test/public';

// add route to /test and send the content
server.HttpServer.App.get('/test', (req, res) => {
    res.sendData(200, ['Test']);
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
});