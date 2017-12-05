const tsc = require('./tsc');
const watch = require('node-watch');

function pCompileTSC(configFile){
    //compile TypeScript server files
    process.stdout.write('Start compile on tsc...');
    tsc(configFile);
    process.stdout.write('compiled!\n');
}

function pCompileTSCW(configFile, watchDir){
    pCompileTSC(configFile);
    watch(watchDir, { recursive: true }, function(evt, name) {
        console.log('Files changed!');
        pCompileTSC(configFile);
    });
}

exports.compileTSC = pCompileTSC;
exports.compileTSCW = pCompileTSCW;