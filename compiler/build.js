const tsc = require('./tsc');
const watch = require('node-watch');
const logger = require('./logger');

function pCompileTSC(configFile){
    //compile TypeScript server files
    logger('\nCompiling TypeScript...');
    tsc(configFile);
    logger('compiled!\n\n');
}

function pCompileTSCW(configFile, watchDir){
    pCompileTSC(configFile);
    watch(watchDir, { recursive: true }, function(evt, name) {
        console.log('Files changed!');
        logger('\n --- Rebuilding ---\n','FgGreen');
        pCompileTSC(configFile);
    });
}

function pTSCW(watchDir, callback){
    return watch(watchDir, { recursive: true }, function(evt, name) {
        if (callback) callback();
    });
}

exports.compileTSC = pCompileTSC;
exports.compileTSCW = pCompileTSCW;
exports.TSCW = pTSCW;