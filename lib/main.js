"use strict";
/*
* TNEMServer unit
* descr: TNEM Complete Pack
* scope: only server
* dependencies:
* author: dpaula
* https://github.com/debersonpaula
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
// ===================================================
// === imports =======================================
//import { TObjectList } from './units/tobjectlist';
var tobjectlist_1 = require("tobjectlist");
var httpServer_1 = require("./units/httpServer");
var mongoServer_1 = require("./units/mongoServer");
var authServer_1 = require("./units/authServer");
// ===================================================
// === classes =======================================
var TNEMAServer = /** @class */ (function (_super) {
    __extends(TNEMAServer, _super);
    function TNEMAServer(SessionID, SecretID) {
        var _this = _super.call(this) || this;
        // initialize servers
        _this.HttpServer = new httpServer_1.THttpServer;
        _this.MongoServer = new mongoServer_1.TMongoServer;
        _this.AuthServer = new authServer_1.TAuthServer(_this.HttpServer, _this.MongoServer, SessionID, SecretID);
        //add to object list
        _this.AddObject(_this.HttpServer);
        _this.AddObject(_this.MongoServer);
        _this.AddObject(_this.AuthServer);
        return _this;
    }
    // FORWARDERS
    // set or get http port
    TNEMAServer.prototype.Port = function (port) {
        if (port) {
            this.HttpServer.httpPort = port;
        }
        return this.HttpServer.httpPort;
    };
    // set or get mongo uri
    TNEMAServer.prototype.MongoSource = function (uri) {
        if (uri) {
            this.MongoServer.mongoURI = uri;
        }
        return this.MongoServer.mongoURI;
    };
    return TNEMAServer;
}(tobjectlist_1.TObjectList));
exports.TNEMAServer = TNEMAServer;
