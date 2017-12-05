"use strict";
/*
* TNEMServer unit
* descr: TNEM Complete Pack
* scope: only server
* dependencies: tserver, mserver, aserver, types
* author: dpaula
* https://github.com/debersonpaula
*/
exports.__esModule = true;
// imports
var tserver_1 = require("./units/tserver");
var mserver_1 = require("./units/mserver");
var aserver_1 = require("./units/aserver");
var TNEMServer = /** @class */ (function () {
    function TNEMServer() {
        // initialize servers
        this.httpServer = new tserver_1.TServer;
        this.mongoServer = new mserver_1.MServer(this.httpServer);
        this.authServer = new aserver_1.AServer(this.httpServer);
        // set default values
        this.httpServer.httpPort = 3000;
        this.mongoServer.mongoURI = '';
    }
    return TNEMServer;
}());
module.exports = new TNEMServer;
