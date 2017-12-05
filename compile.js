//config file
const config = './compiler/build.config.json';

// compile typescript on server
const build = require('./compiler/build');
build.compileTSC(config);