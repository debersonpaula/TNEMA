/*!
 * tnemserver
 * Copyright(c) 2017 Deberson Paula
 * MIT Licensed
 */

'use strict';

exports.createServer = function(){
    return require('./lib/server');
}

exports.tools = require('./compiler/build');