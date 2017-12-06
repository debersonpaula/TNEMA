var fs = require('fs');
var deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

const logger = require('./compiler/logger');
var comp = require('./compiler/build');

logger('\n === START COMPILATION === \n', 'FgCyan');
//deleteFolderRecursive(__dirname + '/lib');
//comp.compileTSC(__dirname + '/tsconfig.json');

// define variables
var server;

// run server first
//startServer();

function startServer(){

    /*---------------------------------------------*/
    logger('=== START SERVER ===\n', 'FgCyan');
    server = require('./lib/main');
    server.HttpServer.httpPort = 3000;
    server.HttpServer.AddStatic(__dirname + '/test/public');
    server.MongoServer.mongoURI = 'mongodb://localhost/test';
    /*---------------------------------------------*/
    logger('=== CREATE APPLICATION ===\n', 'FgCyan');
    server.Create(function(){
        logger('=== CREATE DONE ===\n\n', 'FgGreen');
    });
}

function RunWatch(){
    /*---------------------------------------------*/
    logger('=== RUNNING WATCH ===\n', 'FgCyan');
    var watcher = comp.TSCW(__dirname + '/src/server/',function(){
        logger('Rebuild...\n', 'FgGreen');
        watcher.close();
        stopServer();
    });
}


function stopServer() {
    /*---------------------------------------------*/
    logger('=== STOPPING SERVER ===\n', 'FgCyan');
    server.Destroy(function(){
        // clear cache of builder
        logger('\nclear cache of builder', 'FgBlue');
        delete require.cache[require.resolve('./compiler/build')];  
        comp = require('./compiler/build');
        // recompile tsc files
        logger('\nrecompile tsc files', 'FgBlue');
        comp.compileTSC(__dirname + '/tsconfig.json');
        // clear cache of server component
        logger('\nclear cache of server component\n', 'FgBlue');
        delete require.cache[require.resolve('./lib/main')];
        // restart server
        startServer();
    });
}