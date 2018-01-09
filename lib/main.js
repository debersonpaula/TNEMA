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
Object.defineProperty(exports, "__esModule", { value: true });
// ===================================================
// === imports =======================================
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
        _this._HttpServer = new httpServer_1.THttpServer;
        _this._MongoServer = new mongoServer_1.TMongoServer;
        _this._AuthServer = new authServer_1.TAuthServer(_this._HttpServer, _this._MongoServer, SessionID, SecretID);
        //add to object list
        _this.AddObject(_this._HttpServer);
        _this.AddObject(_this._MongoServer);
        _this.AddObject(_this._AuthServer);
        return _this;
    }
    Object.defineProperty(TNEMAServer.prototype, "HttpServer", {
        // FORWARDERS
        get: function () { return this._HttpServer; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TNEMAServer.prototype, "MongoServer", {
        get: function () { return this._MongoServer; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(TNEMAServer.prototype, "AuthServer", {
        get: function () { return this._AuthServer; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(TNEMAServer.prototype, "Port", {
        // set or get http port
        get: function () {
            return this._HttpServer.httpPort;
        },
        set: function (port) {
            this._HttpServer.httpPort = port;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TNEMAServer.prototype, "MongoSource", {
        // set or get mongo uri
        get: function () {
            return this._MongoServer.mongoURL;
        },
        set: function (url) {
            this._MongoServer.mongoURL = url;
        },
        enumerable: true,
        configurable: true
    });
    return TNEMAServer;
}(tobjectlist_1.TObjectList));
exports.TNEMAServer = TNEMAServer;
